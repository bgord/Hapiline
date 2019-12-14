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
					message: VALIDATION_MESSAGES.positive_integer("habits.*.id"),
					field: "habits.0.id",
					validation: "integer",
				},
				{
					message: VALIDATION_MESSAGES.positive_integer("habits.*.id"),
					field: "habits.0.id",
					validation: "above",
				},
				{
					message: VALIDATION_MESSAGES.positive_integer("habits.*.index"),
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
