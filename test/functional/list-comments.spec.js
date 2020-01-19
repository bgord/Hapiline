const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("List comments");
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

const LIST_COMMENTS_URL = "/api/v1/comments";

test("auth", async ({client}) => {
	const response = await client.get(LIST_COMMENTS_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(LIST_COMMENTS_URL)
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
		.get(LIST_COMMENTS_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("validation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const cases = [
		[
			"",
			[
				{
					message: VALIDATION_MESSAGES.required("habitId"),
					field: "habitId",
					validation: "required",
				},
			],
		],
		[
			"?habitId=xxx",
			[
				{
					message: VALIDATION_MESSAGES.above("habitId", 0),
					field: "habitId",
					validation: "number",
				},
				{
					message: VALIDATION_MESSAGES.above("habitId", 0),
					field: "habitId",
					validation: "above",
				},
			],
		],
	];

	for (const [queryParams, argErrors] of cases) {
		const response = await client
			.get(LIST_COMMENTS_URL + queryParams)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});
