const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, before, after} = use("Test/Suite")("Update notifications");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

before(async () => {
	await ace.call("seed", {}, {silent: true});
});

after(async () => {
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
		.patch(UPDATE_NOTIFICATION_URL(666))
		.loginVia(jim)
		.end();

	assertUnprocessableEntity(response);
});
