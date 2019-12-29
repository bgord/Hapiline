const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Get month");
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const GET_MONTH_URL = "/api/v1/month";

const thisMonth = 0;

test("auth", async ({client}) => {
	const response = await client.get(`${GET_MONTH_URL}/${thisMonth}`).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(`${GET_MONTH_URL}/${thisMonth}`)
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
		.get(`${GET_MONTH_URL}/${thisMonth}`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});
