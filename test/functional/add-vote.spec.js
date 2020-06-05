const ace = require("@adonisjs/ace");
const datefns = require("date-fns");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
	assertUnprocessableEntity,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Add vote");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");
const HABIT_STRENGTH_TYPES = use("HABIT_STRENGTH_TYPES");
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

const ADD_VOTE_URL = "/api/v1/vote";
const ADD_HABIT_URL = "/api/v1/habit";

test("auth", async ({client}) => {
	const response = await client.post(ADD_VOTE_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.post(ADD_VOTE_URL)
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
		.post(ADD_VOTE_URL)
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
					message: VALIDATION_MESSAGES.required("habit_id"),
					field: "habit_id",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("day"),
					field: "day",
					validation: "required",
				},
			],
		],
		[
			{habit_id: "xxx", vote: null, day: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.integer("habit_id"),
					field: "habit_id",
					validation: "integer",
				},
				{
					message: VALIDATION_MESSAGES.above("habit_id", 0),
					field: "habit_id",
					validation: "above",
				},
				{
					message: VALIDATION_MESSAGES.date("day"),
					field: "day",
					validation: "date",
				},
				{
					message: VALIDATION_MESSAGES.before("day", "tomorrow"),
					field: "day",
					validation: "before",
				},
				{
					message: VALIDATION_MESSAGES.after("day", "2 days ago"),
					field: "day",
					validation: "after",
				},
			],
		],
		[
			{habit_id: -2, vote: "xxx", day: datefns.addDays(new Date(), 5)},
			[
				{
					message: VALIDATION_MESSAGES.above("habit_id", 0),
					field: "habit_id",
					validation: "above",
				},
				{
					message: VALIDATION_MESSAGES.invalid_vote,
					field: "vote",
					validation: "in",
				},
				{
					message: VALIDATION_MESSAGES.before("day", "tomorrow"),
					field: "day",
					validation: "before",
				},
			],
		],
		[
			{habit_id: 1, vote: HABIT_VOTE_TYPES.positive, day: datefns.subDays(new Date(), 3)},
			[
				{
					message: VALIDATION_MESSAGES.after("day", "2 days ago"),
					field: "day",
					validation: "after",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const response = await client
			.post(ADD_VOTE_URL)
			.send(payload)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("user cannot add vote to non-existant habits", async ({client}) => {
	const jim = await User.find(users.jim.id);
	const today = new Date();

	const payload = {
		habit_id: 555,
		day: today,
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertValidationError({
		response,
		argErrors: [
			{
				message: VALIDATION_MESSAGES.non_existent_resource("habit_id"),
				field: "habit_id",
				validation: "exists",
			},
		],
	});
});

test("users can add vote to their habits only", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		habit_id: 6,
		day: new Date(),
		comment: null,
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("user cannot add votes to day before habit creation", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		habit_id: 5,
		day: datefns.subDays(new Date(), 2),
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertValidationError({
		response,
		argErrors: [
			{
				message: VALIDATION_MESSAGES.before("day", "habit creation"),
				field: "day",
				validation: "before",
			},
		],
	});
});

test("full flow for non-existant habit vote", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		habit_id: 5,
		day: new Date(),
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(200);

	assert.equal(response.body.habit_id, payload.habit_id);
	assert.ok(datefns.isEqual(new Date(response.body.day), payload.day));
	assert.equal(response.body.vote, null);
});

test("full flow for existing habit vote", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		habit_id: 4,
		day: new Date(),
		vote: HABIT_VOTE_TYPES.regress,
		comment: "The worst thing about the prison was the Dementors",
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assert.equal(response.body.habit_id, payload.habit_id);
	assert.ok(datefns.isSameDay(new Date(response.body.day), payload.day));
	assert.equal(response.body.vote, payload.vote);
});

test("full flow for habit created today", async ({client}) => {
	const dwight = await User.find(users.dwight.id);

	const payload = {
		habit_id: 15,
		day: new Date(),
		vote: HABIT_VOTE_TYPES.regress,
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(dwight)
		.end();

	response.assertStatus(200);
});

test("checks if habit is trackable", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const habitPayload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		strength: HABIT_STRENGTH_TYPES.fresh,
		user_id: users.jim.id,
		description: "What can I say?",
		is_trackable: false,
	};

	const addHabitResponse = await client
		.post(ADD_HABIT_URL)
		.send(habitPayload)
		.loginVia(jim)
		.end();

	addHabitResponse.assertStatus(201);

	const habitId = addHabitResponse.body.id;

	const votePayload = {
		habit_id: habitId,
		day: new Date(),
		vote: HABIT_VOTE_TYPES.regress,
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(votePayload)
		.loginVia(jim)
		.end();

	assertUnprocessableEntity(response);
});

test("emits notification after 5 consecutive progress votes", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const habitPayload = {
		name: "Get up and do something",
		score: HABIT_SCORE_TYPES.positive,
		strength: HABIT_STRENGTH_TYPES.fresh,
		order: 50,
		user_id: jim.id,
		created_at: datefns.subDays(new Date(), 6),
	};

	const [habit] = await Database.into("habits")
		.insert(habitPayload)
		.returning("*");

	// Add votes for days TODAY - x, where 1 >= x <= 4
	// via Database, so we don't get rejected by two days
	// before today vote update policy.
	for (let i = 1; i <= 4; i++) {
		await Database.into("habit_votes").insert({
			habit_id: habit.id,
			day: datefns.subDays(new Date(), i),
			vote: HABIT_VOTE_TYPES.progress,
		});
	}

	// Add a vote for today, so that an vote::updated event
	// is emitted.
	const response = await client
		.post(ADD_VOTE_URL)
		.send({
			habit_id: habit.id,
			day: new Date(),
			vote: HABIT_VOTE_TYPES.progress,
		})
		.loginVia(jim)
		.end();
	response.assertStatus(200);

	await new Promise(resolve => setTimeout(resolve, 1000));

	const [notification] = await Database.select("*")
		.from("notifications")
		.where({
			content: `You have 5 progress votes for '${habitPayload.name}'!`,
		});
	assert.ok(notification);
});
