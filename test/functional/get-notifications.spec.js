const ace = require("@adonisjs/ace");

const {assertInvalidSession, assertAccessDenied} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, before, after} = use("Test/Suite")("Get notifications");
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

const GET_NOTIFICATIONS_URL = "/api/v1/notifications";

test("auth", async ({client}) => {
	const response = await client.get(GET_NOTIFICATIONS_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(GET_NOTIFICATIONS_URL)
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
		.get(GET_NOTIFICATIONS_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});
