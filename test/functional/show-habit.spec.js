const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Show habit");
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
	assertNotFoundError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");

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

const SHOW_HABIT_URL = "/api/v1/habit";
const ADD_HABIT_URL = "/api/v1/habit";

test("auth", async ({client}) => {
	const response = await client.get(`${SHOW_HABIT_URL}/x`).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(`${SHOW_HABIT_URL}/x`)
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
		.get(`${SHOW_HABIT_URL}/x`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const habitId = 50;

	const response = await client
		.get(`${SHOW_HABIT_URL}/${habitId}`)
		.loginVia(pam)
		.end();

	response.assertStatus(200);
	assert.equal(response.body.id, habitId);
	assert.equal(response.body.user_id, pam.id);
	assert.equal(response.body.progress_streak, 1);
	assert.equal(response.body.regress_streak, 0);
});

test("full flow for a habit with no votes", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const habitId = 31;

	const response = await client
		.get(`${SHOW_HABIT_URL}/${habitId}`)
		.loginVia(pam)
		.end();

	response.assertStatus(200);
	assert.equal(response.body.id, habitId);
	assert.equal(response.body.user_id, pam.id);
	assert.equal(response.body.progress_streak, 0);
	assert.equal(response.body.regress_streak, 0);
});

test("user cannot access non-existent resource", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(`${SHOW_HABIT_URL}/1111111`)
		.loginVia(jim)
		.end();

	assertNotFoundError(response);
});

test("user cannot access other users' resources", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(`${SHOW_HABIT_URL}/12`)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("return 0 day streaks for untracked habits", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		strength: HABIT_STRENGTH_TYPES.fresh,
		user_id: users.jim.id,
		description: "What can I say?",
		is_trackable: false,
	};

	const addHabitResponse = await client
		.post(ADD_HABIT_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	addHabitResponse.assertStatus(201);

	const habitId = addHabitResponse.body.id;

	const response = await client
		.get(`${SHOW_HABIT_URL}/${habitId}`)
		.loginVia(jim)
		.end();

	assert.equal(response.body.progress_streak, 0);
	assert.equal(response.body.regress_streak, 0);
});
