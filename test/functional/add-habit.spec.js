const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Add habit");
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
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");
const HABIT_STRENGTH_TYPES = use("HABIT_STRENGTH_TYPES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const ADD_HABIT_URL = "/api/v1/habit";

test("auth", async ({client}) => {
	const response = await client.post(ADD_HABIT_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.post(ADD_HABIT_URL)
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
		.post(ADD_HABIT_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("validation", async ({client}) => {
	const pam = await User.find(users.pam.id);

	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("name"),
					field: "name",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("score"),
					field: "score",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("strength"),
					field: "strength",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("user_id"),
					field: "user_id",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("is_trackable"),
					field: "is_trackable",
					validation: "required",
				},
			],
		],
		[
			{
				name: "x".repeat(256),
				score: "xxx",
				strength: "xxx",
				user_id: "xxxx",
				description: "x".repeat(1025),
				is_trackable: "xxx",
			},
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
				{
					message: VALIDATION_MESSAGES.invalid_strength,
					field: "strength",
					validation: "in",
				},
				{
					message: VALIDATION_MESSAGES.integer("user_id"),
					field: "user_id",
					validation: "integer",
				},
				{
					message: VALIDATION_MESSAGES.above("user_id", 0),
					field: "user_id",
					validation: "above",
				},
				{
					message: VALIDATION_MESSAGES.invalid_description,
					field: "description",
					validation: "max",
				},
				{
					message: VALIDATION_MESSAGES.boolean("is_trackable"),
					field: "is_trackable",
					validation: "boolean",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.post(ADD_HABIT_URL)
			.send(payload)
			.loginVia(pam)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("user can only add their own habit", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		strength: HABIT_STRENGTH_TYPES.fresh,
		user_id: users.pam.id,
		is_trackable: true,
	};

	const response = await client
		.post(ADD_HABIT_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		strength: HABIT_STRENGTH_TYPES.fresh,
		user_id: users.jim.id,
		description: "What can I say?",
		is_trackable: true,
	};

	const response = await client
		.post(ADD_HABIT_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(201);
	assert.equal(response.body.name, payload.name);
	assert.equal(response.body.score, payload.score);
	assert.equal(response.body.user_id, payload.user_id);
	assert.equal(response.body.description, payload.description);
});

test("cannot insert two identical records", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		strength: HABIT_STRENGTH_TYPES.fresh,
		user_id: jim.id,
		is_trackable: true,
	};

	const firstResponse = await client
		.post(ADD_HABIT_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	firstResponse.assertStatus(201);
	assert.equal(firstResponse.body.name, payload.name);
	assert.equal(firstResponse.body.score, payload.score);
	assert.equal(firstResponse.body.user_id, payload.user_id);

	const secondResponse = await client
		.post(ADD_HABIT_URL)
		.send(payload)
		.loginVia(jim)
		.end();
	assertValidationError({
		response: secondResponse,
		argErrors: [
			{
				message: VALIDATION_MESSAGES.unique_habit,
				field: "name",
				validation: "unique",
			},
		],
	});
});
