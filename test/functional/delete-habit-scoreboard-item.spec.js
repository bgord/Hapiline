const {test, trait, beforeEach, afterEach} = use("Test/Suite")(
	"Delete habit scoreboard item",
);
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
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

const DELETE_HABIT_SCOREBOARD_ITEM_URL = "/api/v1/habit-scoreboard-item";

test("auth", async ({client}) => {
	const response = await client
		.delete(`${DELETE_HABIT_SCOREBOARD_ITEM_URL}/1`)
		.end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.delete(`${DELETE_HABIT_SCOREBOARD_ITEM_URL}/1`)
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
		.delete(`${DELETE_HABIT_SCOREBOARD_ITEM_URL}/1`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("user can only delete their own habit scoreboard items", async ({
	client,
}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.delete(`${DELETE_HABIT_SCOREBOARD_ITEM_URL}/6`)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("user cannot delete unexistent scoreboard items", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.delete(`${DELETE_HABIT_SCOREBOARD_ITEM_URL}/6666xxx`)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const resourceBefore = await Database.table("habit_scoreboard_items")
		.where({
			id: 1,
		})
		.first();
	assert.equal(resourceBefore.id, 1);
	assert.equal(resourceBefore.user_id, 2);

	const response = await client
		.delete(`${DELETE_HABIT_SCOREBOARD_ITEM_URL}/1`)
		.loginVia(jim)
		.end();

	response.assertStatus(200);

	const resourceAfter = await Database.table("habit_scoreboard_items")
		.where({
			id: 1,
		})
		.first();

	assert.isNotOk(resourceAfter);
});
