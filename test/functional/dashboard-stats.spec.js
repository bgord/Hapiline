const ace = require("@adonisjs/ace");

const {assertAccessDenied, assertInvalidSession} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Dashboard stats");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");
const HABIT_STRENGTH_TYPES = use("HABIT_STRENGTH_TYPES");

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
const ADD_HABIT_URL = "/api/v1/habit";

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

	const firstResponse = await client
		.get(DASHBOARD_STATS_URL)
		.loginVia(jim)
		.end();

	assert.deepEqual(firstResponse.body, {
		today: {
			progressVotes: 0,
			plateauVotes: 1,
			regressVotes: 1,
			noVotes: 3,
			allVotes: 2,
			maximumVotes: 5,
			untrackedHabits: 0,
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

	const payload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		strength: HABIT_STRENGTH_TYPES.fresh,
		user_id: jim.id,
		is_trackable: false,
	};

	const habitResponse = await client
		.post(ADD_HABIT_URL)
		.send(payload)
		.loginVia(jim)
		.end();
	habitResponse.assertStatus(201);

	const secondResponse = await client
		.get(DASHBOARD_STATS_URL)
		.loginVia(jim)
		.end();

	assert.deepEqual(secondResponse.body, {
		today: {
			progressVotes: 0,
			plateauVotes: 1,
			regressVotes: 1,
			noVotes: 3,
			allVotes: 2,
			maximumVotes: 5,
			untrackedHabits: 1,
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
