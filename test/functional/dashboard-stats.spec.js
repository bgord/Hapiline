const ace = require("@adonisjs/ace");

const {assertAccessDenied, assertInvalidSession} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Dashboard stats");
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

const DASHBOARD_STATS_URL = "/api/v1/dashboard-stats";

test("auth", async ({client}) => {
	const response = await client.get(DASHBOARD_STATS_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(DASHBOARD_STATS_URL)
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
		.get(DASHBOARD_STATS_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(DASHBOARD_STATS_URL)
		.loginVia(jim)
		.end();

	assert.deepEqual(response.body, {
		today: {
			progressVotes: 0,
			plateauVotes: 1,
			regressVotes: 1,
			allHabits: 5,
			noVotes: 3,
			allVotes: 2,
		},
		lastWeek: {
			progressVotes: 1,
			plateauVotes: 1,
			regressVotes: 1,
			noVotes: 6,
			allVotes: 3,
			maximumVotes: 9,
		},
		lastMonth: {
			progressVotes: 1,
			plateauVotes: 1,
			regressVotes: 1,
			noVotes: 6,
			allVotes: 3,
			maximumVotes: 9,
		},
	});
});
