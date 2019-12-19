const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Edit habit");
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const Database = use("Database");
const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const REORDER_HABITS_URL = "/api/v1/reorder-habits";

test("auth", async ({client}) => {
	const response = await client.patch(REORDER_HABITS_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.patch(REORDER_HABITS_URL)
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
		.patch(REORDER_HABITS_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("validation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("habits"),
					field: "habits",
					validation: "required",
				},
			],
		],
		[
			{habits: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.array("habits"),
					field: "habits",
					validation: "array",
				},
			],
		],
		[
			{habits: [{biz: "nys"}]},
			[
				{
					message: VALIDATION_MESSAGES.required("habits.*.id"),
					field: "habits.0.id",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("habits.*.index"),
					field: "habits.0.index",
					validation: "required",
				},
			],
		],

		[
			{habits: [{id: "nys", index: -22}]},
			[
				{
					message: VALIDATION_MESSAGES.positive_integer_or_zero("habits.*.id"),
					field: "habits.0.id",
					validation: "integer",
				},
				{
					message: VALIDATION_MESSAGES.positive_integer_or_zero("habits.*.id"),
					field: "habits.0.id",
					validation: "above",
				},
				{
					message: VALIDATION_MESSAGES.positive_integer_or_zero(
						"habits.*.index",
					),
					field: "habits.0.index",
					validation: "above",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.patch(REORDER_HABITS_URL)
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("check if every habit id belongs to the user", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const notJimsHabit = await Database.table("habits")
		.where("user_id", "<>", jim.id)
		.first();

	const payload = {habits: [{index: 0, id: notJimsHabit.id}]};

	const response = await client
		.patch(REORDER_HABITS_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("check if every habitId is supplied", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const [, ...restOfTheJimsHabitIds] = await Database.table("habits")
		.where("user_id", jim.id)
		.select("id")
		.map(entry => entry.id);

	const payload = {
		habits: restOfTheJimsHabitIds.map((habitId, index) => ({
			id: habitId,
			index,
		})),
	};

	const response = await client
		.patch(REORDER_HABITS_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertValidationError({
		response,
		message: MAIN_ERROR_MESSAGES.not_all_habit_ids_supplied,
	});
});

test("check indexes order", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const jimsHabitIds = await Database.table("habits")
		.where("user_id", jim.id)
		.select("id")
		.map(entry => entry.id);

	const payload = {
		habits: jimsHabitIds.map((habitId, index) => ({
			id: habitId,
			index: index * 2,
		})),
	};

	const response = await client
		.patch(REORDER_HABITS_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertValidationError({
		response,
		message: MAIN_ERROR_MESSAGES.indexes_out_of_order,
	});
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const jimsHabitsBeforeUpdate = await Database.table("habits").where(
		"user_id",
		jim.id,
	);

	const idToOrderBeforeUpdate = {
		1: 0,
		2: 1,
		3: 2,
		4: 3,
		5: 4,
	};

	for (let jimHabitBeforeUpdate of jimsHabitsBeforeUpdate) {
		assert.equal(
			jimHabitBeforeUpdate.order,
			idToOrderBeforeUpdate[jimHabitBeforeUpdate.id],
		);
	}

	const payload = {
		habits: [...jimsHabitsBeforeUpdate]
			.map(habit => habit.id)
			.reverse()
			.map((habitId, index) => ({
				id: habitId,
				index,
			})),
	};

	const response = await client
		.patch(REORDER_HABITS_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(200);

	const jimsHabitsAfterUpdate = await Database.table("habits").where(
		"user_id",
		jim.id,
	);

	const idToOrderAfterUpdate = {
		1: 4,
		2: 3,
		3: 2,
		4: 1,
		5: 0,
	};

	for (let jimHabitAfterUpdate of jimsHabitsAfterUpdate) {
		assert.equal(
			jimHabitAfterUpdate.order,
			idToOrderAfterUpdate[jimHabitAfterUpdate.id],
		);
	}
});
