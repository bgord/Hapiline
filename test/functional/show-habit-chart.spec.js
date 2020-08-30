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
const HABIT_VOTE_CHART_DATE_RANGE = use("HABIT_VOTE_CHART_DATE_RANGE");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const datefns = require("date-fns");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");
const HABIT_STRENGTH_TYPES = use("HABIT_STRENGTH_TYPES");

const timezone = "Europe/Warsaw";

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
const ADD_HABIT_URL = "/api/v1/habit";

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
		.get(`${SHOW_HABIT_CHART_URL}/6?habitVoteChartDateRange=last_week`)
		.header("timezone", timezone)
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
					message: VALIDATION_MESSAGES.required("habitVoteChartDateRange"),
					field: "habitVoteChartDateRange",
					validation: "required",
				},
			],
		],
		[
			{habitVoteChartDateRange: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.invalid_habit_vote_chart_date_range,
					field: "habitVoteChartDateRange",
					validation: "in",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const response = await client
			.get(`${SHOW_HABIT_CHART_URL}/5`)
			.header("timezone", timezone)
			.query(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const response = await client
		.get(`${SHOW_HABIT_CHART_URL}/2`)
		.header("timezone", timezone)
		.query({habitVoteChartDateRange: HABIT_VOTE_CHART_DATE_RANGE.last_week})
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

test("check if habit is trackable", async ({client}) => {
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
		.get(`${SHOW_HABIT_CHART_URL}/${habitId}`)
		.header("timezone", timezone)
		.query({habitVoteChartDateRange: HABIT_VOTE_CHART_DATE_RANGE.last_week})
		.loginVia(jim)
		.end();

	assertUnprocessableEntity(response);
});
