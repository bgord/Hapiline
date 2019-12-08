const {test, trait, beforeEach, afterEach} = use("Test/Suite")(
	"Edit habit scoreboard item",
);
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

const EDIT_HABIT_SCOREBOARD_ITEM_URL = "/api/v1/habit-scoreboard-item";

test("auth", async ({client}) => {
	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/1`)
		.end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/1`)
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
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/1`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("checks if entity can be processed", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/111`)
		.loginVia(jim)
		.end();

	assertUnprocessableEntity(response);
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const habitBeforeUpdate = await Database.table("habit_scoreboard_items")
		.where({
			user_id: jim.id,
			name: "0 lorem",
		})
		.first();
	assert.equal(habitBeforeUpdate.name, "0 lorem");

	const payload = {
		name: "xxx",
	};

	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/${habitBeforeUpdate.id}`)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(200);

	const habitAfterUpdate = await Database.table("habit_scoreboard_items")
		.where({
			id: habitBeforeUpdate.id,
		})
		.first();
	assert.equal(habitAfterUpdate.name, payload.name);
});

test("user cannot update not their own habit", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/10`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});
