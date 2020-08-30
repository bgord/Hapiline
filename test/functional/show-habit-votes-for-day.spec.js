const ace = require("@adonisjs/ace");
const datefns = require("date-fns");

const {
	assertAccessDenied,
	assertInvalidSession,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, before, after} = use("Test/Suite")("Show habit votes for day");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const timezone = "Europe/Warsaw";

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

before(async () => {
	await ace.call("seed", {}, {silent: true});
});

after(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const GET_DAY_VOTES_URL = "/api/v1/day-votes";

test("auth", async ({client}) => {
	const response = await client.get(GET_DAY_VOTES_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(GET_DAY_VOTES_URL)
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
		.get(GET_DAY_VOTES_URL)
		.loginVia(pam)
		.end();
	assertAccessDenied(response);
});

test("validation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("day"),
					field: "day",
					validation: "required",
				},
			],
		],
		[
			{day: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.date("day"),
					field: "day",
					validation: "date",
				},
			],
		],
		[
			{day: datefns.addDays(new Date(), 5)},
			[
				{
					message: VALIDATION_MESSAGES.not_in_the_future("day"),
					field: "day",
					validation: "not-in-the-future",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const response = await client
			.get(GET_DAY_VOTES_URL)
			.header("timezone", timezone)
			.query(payload)
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);
	const today = new Date();

	const response = await client
		.get(GET_DAY_VOTES_URL)
		.header("timezone", timezone)
		.query({day: today})
		.loginVia(jim)
		.end();

	assert.equal(response.body[0].id, 2);
	assert.equal(response.body[0].habit_id, 2);
	assert.equal(response.body[0].vote, HABIT_VOTE_TYPES.plateau);
	assert.equal(response.body[0].comment, "lorem");

	assert.equal(response.body[1].id, 3);
	assert.equal(response.body[1].vote, HABIT_VOTE_TYPES.regress);
	assert.equal(response.body[1].comment, null);
	assert.equal(response.body[1].habit_id, 4);
});
