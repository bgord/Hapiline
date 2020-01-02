const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Show habit chart");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const SHOW_HABIT_CHART_URL = "/api/v1/habit-chart";

test("auth", async ({client}) => {
	const response = await client.get(`${SHOW_HABIT_CHART_URL}/x`).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(`${SHOW_HABIT_CHART_URL}/x`)
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
		.get(`${SHOW_HABIT_CHART_URL}/x`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("assures the habit exists", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(`${SHOW_HABIT_CHART_URL}/555`)
		.loginVia(jim)
		.end();

	assertUnprocessableEntity(response);
});
