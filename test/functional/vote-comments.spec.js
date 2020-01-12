const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Vote comments");
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

const ADD_VOTE_COMMENT_URL = habitVoteId => `/api/v1/vote/${habitVoteId}/comment`;

test("auth", async ({client}) => {
	const response = await client.patch(ADD_VOTE_COMMENT_URL(1)).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.patch(ADD_VOTE_COMMENT_URL(1))
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
		.patch(ADD_VOTE_COMMENT_URL(1))
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("comment can be added only to an existing vote", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(ADD_VOTE_COMMENT_URL(555))
		.loginVia(jim)
		.end();
	assertUnprocessableEntity(response);
});

test("validation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const cases = [
		[
			{comment: 222},
			[{message: VALIDATION_MESSAGES.invalid_comment, field: "comment", validation: "string"}],
		],
		[
			{comment: "0".repeat(1025)},
			[{message: VALIDATION_MESSAGES.invalid_comment, field: "comment", validation: "max"}],
		],
	];

	for (const [payload, argErrors] of cases) {
		const response = await client
			.patch(ADD_VOTE_COMMENT_URL(5))
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("user can add comment to votes only for their own habits", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const payload = {};

	const response = await client
		.patch(ADD_VOTE_COMMENT_URL(5))
		.send(payload)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});
