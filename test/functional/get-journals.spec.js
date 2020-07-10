const {test, trait, before, after} = use("Test/Suite")("Get journals");
const ace = require("@adonisjs/ace");
const datefns = require("date-fns");
const User = use("User");
const {assertInvalidSession, assertAccessDenied} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const Journal = use("Journal");
const SORT_JOURNAL_BY_OPTIONS = use("SORT_JOURNAL_BY_OPTIONS");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

before(async () => {
	await ace.call("seed", {}, {silent: true});
});

after(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const GET_JOURNALS_URL = "/api/v1/journals";

test("auth", async ({client}) => {
	const response = await client
		.get(`${GET_JOURNALS_URL}?sort=${SORT_JOURNAL_BY_OPTIONS.days_desc}`)
		.end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(`${GET_JOURNALS_URL}?sort=${SORT_JOURNAL_BY_OPTIONS.days_desc}`)
		.loginVia(admin)
		.end();
	assertAccessDenied(response);
});

test("account-status:(active)", async ({client}) => {
	const pam = await User.find(users.pam.id);
	pam.merge({
		account_status: ACCOUNT_STATUSES.pending,
	});
	await pam.save();

	const response = await client
		.get(`${GET_JOURNALS_URL}?sort=${SORT_JOURNAL_BY_OPTIONS.days_desc}`)
		.loginVia(pam)
		.end();
	assertAccessDenied(response);
});

test("filters out empty journals", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const firstResponse = await client
		.get(GET_JOURNALS_URL)
		.loginVia(pam)
		.end();

	firstResponse.assertStatus(200);
	assert.lengthOf(firstResponse.body, 1);

	const journal = firstResponse.body[0];

	assert.equal(journal.user_id, pam.id);
	assert.hasAllKeys(journal, ["id", "user_id", "content", "day", "created_at", "updated_at"]);

	const _journal = await Journal.find(journal.id);
	_journal.merge({
		content: "",
	});
	await _journal.save();

	const secondResponse = await client
		.get(GET_JOURNALS_URL)
		.loginVia(pam)
		.end();

	secondResponse.assertStatus(200);
	assert.lengthOf(secondResponse.body, 0);
});

test("sorting - days_desc", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const yesterday = datefns.format(datefns.subDays(new Date(), 1), "yyyy-MM-dd");

	await Journal.create({
		user_id: users.jim.id,
		content: "content",
		day: yesterday,
	});

	const response = await client
		.get(`${GET_JOURNALS_URL}?sort=${SORT_JOURNAL_BY_OPTIONS.days_desc}`)
		.loginVia(jim)
		.end();

	response.assertStatus(200);
	assert.lengthOf(response.body, 2);

	const firstJournal = response.body[0];
	const secondJournal = response.body[1];

	assert.equal(firstJournal.user_id, jim.id);
	assert.hasAllKeys(firstJournal, ["id", "user_id", "content", "day", "created_at", "updated_at"]);

	assert.equal(secondJournal.user_id, jim.id);
	assert.hasAllKeys(secondJournal, ["id", "user_id", "content", "day", "created_at", "updated_at"]);

	assert.ok(datefns.isAfter(new Date(firstJournal.day), new Date(secondJournal.day)));
});

test("sorting - days_asc", async ({client, assert}) => {
	const dwight = await User.find(users.dwight.id);

	const dayBeforeYesterday = datefns.format(datefns.subDays(new Date(), 2), "yyyy-MM-dd");

	await Journal.create({
		user_id: users.dwight.id,
		content: "content",
		day: dayBeforeYesterday,
	});

	const response = await client
		.get(`${GET_JOURNALS_URL}?sort=${SORT_JOURNAL_BY_OPTIONS.days_asc}`)
		.loginVia(dwight)
		.end();

	response.assertStatus(200);
	assert.lengthOf(response.body, 2);

	const firstJournal = response.body[0];
	const secondJournal = response.body[1];

	assert.equal(firstJournal.user_id, dwight.id);
	assert.hasAllKeys(firstJournal, ["id", "user_id", "content", "day", "created_at", "updated_at"]);

	assert.equal(secondJournal.user_id, dwight.id);
	assert.hasAllKeys(secondJournal, ["id", "user_id", "content", "day", "created_at", "updated_at"]);

	assert.ok(datefns.isBefore(new Date(firstJournal.day), new Date(secondJournal.day)));
});
