const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Delete habit");
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const Database = use("Database");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const DELETE_HABIT_URL = "/api/v1/habit";

test("auth", async ({client}) => {
	const response = await client.delete(`${DELETE_HABIT_URL}/1`).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.delete(`${DELETE_HABIT_URL}/1`)
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
		.delete(`${DELETE_HABIT_URL}/1`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("user can only delete their own habit", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.delete(`${DELETE_HABIT_URL}/6`)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("user cannot delete unexistent habits", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.delete(`${DELETE_HABIT_URL}/6666xxx`)
		.loginVia(jim)
		.end();
	assertUnprocessableEntity(response);
});

test("full flow", async ({client, assert}) => {
	const dwight = await User.find(users.dwight.id);

	const habitId = 6;

	const resourceBefore = await Database.table("habits")
		.where({
			id: habitId,
		})
		.first();
	assert.equal(resourceBefore.user_id, dwight.id);

	const response = await client
		.delete(`${DELETE_HABIT_URL}/${habitId}`)
		.loginVia(dwight)
		.end();

	response.assertStatus(200);

	const resourceAfter = await Database.table("habits")
		.where({
			id: habitId,
		})
		.first();

	assert.isNotOk(resourceAfter);
});
