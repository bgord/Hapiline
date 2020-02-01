const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Update notifications");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const NOTIFICATION_STATUSES = use("NOTIFICATION_STATUSES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const UPDATE_NOTIFICATION_URL = id => `/api/v1/notification/${id}`;

test("auth", async ({client}) => {
	const response = await client.patch(UPDATE_NOTIFICATION_URL(1)).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.patch(UPDATE_NOTIFICATION_URL(1))
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
		.patch(UPDATE_NOTIFICATION_URL(1))
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("checks if notification exists", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(UPDATE_NOTIFICATION_URL(111))
		.loginVia(jim)
		.end();

	assertUnprocessableEntity(response);
});

test("validation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("status"),
					field: "status",
					validation: "required",
				},
			],
		],
		[
			{status: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.invalid_notification_status,
					field: "status",
					validation: "in",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const response = await client
			.patch(UPDATE_NOTIFICATION_URL(1))
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("checks if notification belongs to the user", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(UPDATE_NOTIFICATION_URL(2))
		.send({
			status: NOTIFICATION_STATUSES.read,
		})
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(UPDATE_NOTIFICATION_URL(1))
		.send({
			status: NOTIFICATION_STATUSES.read,
		})
		.loginVia(jim)
		.end();

	assert.equal(response.body.status, NOTIFICATION_STATUSES.read);
});
