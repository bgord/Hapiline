const {test, trait, before, after} = use("Test/Suite")("Get journals");
const ace = require("@adonisjs/ace");
const User = use("User");
const {assertInvalidSession, assertAccessDenied} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const Journal = use("Journal");

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
	const response = await client.get(GET_JOURNALS_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(GET_JOURNALS_URL)
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
		.get(GET_JOURNALS_URL)
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
