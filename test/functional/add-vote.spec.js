const ace = require("@adonisjs/ace");
const datefns = require("date-fns");

const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Add vote");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const User = use("User");
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

const ADD_VOTE_URL = "/api/v1/vote";

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
		day: datefns.subDays(new Date(), 50),
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
		day: datefns.subDays(new Date(), 1),
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(jim)
		.end();

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
		day: new Date(datefns.format(new Date(), "yyyy-MM-dd")),
		vote: HABIT_VOTE_TYPES.regress,
	};

	const response = await client
		.post(ADD_VOTE_URL)
		.send(payload)
		.loginVia(dwight)
		.end();

	response.assertStatus(200);
});
