const ace = require("@adonisjs/ace");
const qs = require("qs");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertUnprocessableEntity,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Show habit chart");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const CHART_DATE_RANGES = use("CHART_DATE_RANGES");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const datefns = require("date-fns");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

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

test("user can only access their own habit's chart", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(`${SHOW_HABIT_CHART_URL}/6?dateRange=last_week`)
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

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const queryString = qs.stringify({
		dateRange: CHART_DATE_RANGES.last_week,
	});

	const response = await client
		.get(`${SHOW_HABIT_CHART_URL}/2?${queryString}`)
		.loginVia(jim)
		.end();

	const today = new Date();

	assert.ok(datefns.isSameDay(new Date(response.body[0].day), datefns.subDays(today, 6)));
	assert.equal(response.body[0].vote, null);

	assert.ok(datefns.isSameDay(new Date(response.body[1].day), datefns.subDays(today, 5)));
	assert.equal(response.body[1].vote, null);

	assert.ok(datefns.isSameDay(new Date(response.body[2].day), datefns.subDays(today, 4)));
	assert.equal(response.body[2].vote, null);

	assert.ok(datefns.isSameDay(new Date(response.body[3].day), datefns.subDays(today, 3)));
	assert.equal(response.body[3].vote, null);

	assert.ok(datefns.isSameDay(new Date(response.body[4].day), datefns.subDays(today, 2)));
	assert.equal(response.body[4].vote, null);

	assert.ok(datefns.isSameDay(new Date(response.body[5].day), datefns.subDays(today, 1)));
	assert.equal(response.body[5].vote, HABIT_VOTE_TYPES.progress);

	assert.ok(datefns.isSameDay(new Date(response.body[6].day), today));
	assert.equal(response.body[6].vote, HABIT_VOTE_TYPES.plateau);
});
