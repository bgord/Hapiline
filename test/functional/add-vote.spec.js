const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Add vote");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
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

const ADD_VOTE_URL = "/api/v1/vote";

test("auth", async ({client}) => {
	const response = await client.post(ADD_VOTE_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.post(ADD_VOTE_URL)
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
		.post(ADD_VOTE_URL)
		.loginVia(jim)
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
					message: VALIDATION_MESSAGES.required("habit_id"),
					field: "habit_id",
					validation: "required",
				},
			],
		],
		[
			{habit_id: "xxx", vote: null},
			[
				{
					message: VALIDATION_MESSAGES.integer("habit_id"),
					field: "habit_id",
					validation: "integer",
				},

				{
					message: VALIDATION_MESSAGES.above("habit_id", 0),
					field: "habit_id",
					validation: "above",
				},
			],
		],
		[
			{habit_id: -2, vote: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.above("habit_id", 0),
					field: "habit_id",
					validation: "above",
				},
				{
					message: VALIDATION_MESSAGES.invalid_vote,
					field: "vote",
					validation: "in",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const response = await client
			.post(ADD_VOTE_URL)
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});
