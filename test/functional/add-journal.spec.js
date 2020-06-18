const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Add journal");
const datefns = require("date-fns");
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const ADD_JOURNAL_URL = "/api/v1/journal";

test("auth", async ({client}) => {
	const response = await client.post(ADD_JOURNAL_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.post(ADD_JOURNAL_URL)
		.loginVia(admin)
		.end();
	assertAccessDenied(response);
});

test("account-status:(active)", async ({client}) => {
	const jim = await User.find(users.jim.id);
	jim.merge({
		account_status: ACCOUNT_STATUSES.pending,
	});
	await jim.save();

	const response = await client
		.post(ADD_JOURNAL_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("validation", async ({client}) => {
	const pam = await User.find(users.pam.id);

	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("day"),
					field: "day",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("content"),
					field: "content",
					validation: "required",
				},
			],
		],
		[
			{day: "xxx", content: 123},
			[
				{
					message: VALIDATION_MESSAGES.date("day"),
					field: "day",
					validation: "date",
				},
				{
					message: VALIDATION_MESSAGES.before("day", "tomorrow"),
					field: "day",
					validation: "before",
				},
				{
					message: VALIDATION_MESSAGES.string("content"),
					field: "content",
					validation: "string",
				},
			],
		],
		[
			{day: datefns.format(datefns.addDays(new Date(), 1), "yyyy-MM-dd"), content: "123"},
			[
				{
					message: VALIDATION_MESSAGES.before("day", "tomorrow"),
					field: "day",
					validation: "before",
				},
			],
		],
		[
			{day: datefns.format(datefns.subDays(new Date(), 10), "yyyy-MM-dd"), content: "123"},
			[
				{
					message: VALIDATION_MESSAGES.same_or_after(
						"day",
						"day of the creation of the first habit",
					),
					field: "day",
					validation: "same_or_after",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.post(ADD_JOURNAL_URL)
			.send(payload)
			.loginVia(pam)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("full flow updating", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);
	const today = datefns.format(new Date(), "yyyy-MM-dd");
	const payload = {
		day: today,
		content: "Lorem ipsum".repeat(20),
	};

	const response = await client
		.post(ADD_JOURNAL_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(200);
	assert.equal(response.body.user_id, jim.id);
	assert.equal(response.body.content, payload.content);
	assert.ok(datefns.isEqual(datefns.parseISO(response.body.day), datefns.parseISO(today)));
});
test("full flow creating", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);
	const yesterday = datefns.format(datefns.subDays(new Date(), 1), "yyyy-MM-dd");
	const payload = {
		day: yesterday,
		content: "Lorem ipsum".repeat(20),
	};

	const response = await client
		.post(ADD_JOURNAL_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(201);
	assert.equal(response.body.user_id, jim.id);
	assert.equal(response.body.content, payload.content);
	assert.ok(datefns.isEqual(datefns.parseISO(response.body.day), datefns.parseISO(yesterday)));
});
