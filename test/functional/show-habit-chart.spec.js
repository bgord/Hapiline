const ace = require("@adonisjs/ace");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Show habit chart");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");

const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const qs = require("qs");

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

test("user can only delete their own habit", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(`${SHOW_HABIT_CHART_URL}/6`)
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
					message: VALIDATION_MESSAGES.required("dateRange"),
					field: "dateRange",
					validation: "required",
				},
			],
		],
		[
			{dateRange: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.invalid_chart_date_range,
					field: "dateRange",
					validation: "in",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const queryString = qs.stringify(payload);

		const response = await client
			.get(`${SHOW_HABIT_CHART_URL}/5?${queryString}`)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});
