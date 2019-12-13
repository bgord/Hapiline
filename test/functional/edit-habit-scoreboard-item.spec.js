const {test, trait, beforeEach, afterEach} = use("Test/Suite")(
	"Edit habit scoreboard item",
);
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const HabitScoreboardItem = use("HabitScoreboardItem");

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

test("user cannot update not their own habit", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/10`)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("validation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const cases = [
		[
			{score: "xxx", name: "x".repeat(256)},
			[
				{
					message: VALIDATION_MESSAGES.max("name", 255),
					field: "name",
					validation: "max",
				},
				{
					message: VALIDATION_MESSAGES.invalid_score,
					field: "score",
					validation: "in",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/1`)
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const habitScoreboardItemBeforeUpdate = await HabitScoreboardItem.find(1);
	assert.equal(habitScoreboardItemBeforeUpdate.name, "0 lorem");
	assert.equal(habitScoreboardItemBeforeUpdate.score, "positive");

	const payload = {
		score: "negative",
		name: "Prison Mike",
	};

	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/1`)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(200);

	const habitScoreboardItemAfterUpdate = await HabitScoreboardItem.find(1);
	assert.equal(habitScoreboardItemAfterUpdate.name, payload.name);
	assert.equal(habitScoreboardItemAfterUpdate.score, payload.score);
});

test("identical habit name error", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const firstHabit = await HabitScoreboardItem.find(1);
	assert.equal(firstHabit.name, "0 lorem");
	assert.equal(firstHabit.score, "positive");

	const secondHabit = await HabitScoreboardItem.find(2);
	assert.equal(secondHabit.name, "1 loremlorem");
	assert.equal(secondHabit.score, "neutral");

	const payload = {
		score: "negative",
		name: "0 lorem",
	};

	const response = await client
		.patch(`${EDIT_HABIT_SCOREBOARD_ITEM_URL}/2`)
		.send(payload)
		.loginVia(jim)
		.end();

	assertValidationError({
		response,
		argErrors: [
			{
				message: VALIDATION_MESSAGES.unique_habitscoreboard_item,
				field: "name",
				validation: "unique",
			},
		],
	});
});
