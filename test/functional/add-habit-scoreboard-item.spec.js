const {test, trait, beforeEach, afterEach} = use("Test/Suite")(
	"Add habit scoreboard item",
);
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

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const ADD_HABIT_SCOREBOARD_ITEM_URL = "/api/v1/habit-scoreboard-item";

test("auth", async ({client}) => {
	const response = await client.post(ADD_HABIT_SCOREBOARD_ITEM_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.post(ADD_HABIT_SCOREBOARD_ITEM_URL)
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
		.post(ADD_HABIT_SCOREBOARD_ITEM_URL)
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
					message: VALIDATION_MESSAGES.required("user_id"),
					field: "user_id",
					validation: "required",
				},
			],
		],
		[
			{
				name: "x".repeat(256),
				score: "xxx",
				user_id: "xxxx",
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
					message: VALIDATION_MESSAGES.integer("user_id"),
					field: "user_id",
					validation: "integer",
				},
				{
					message: VALIDATION_MESSAGES.above("user_id", 0),
					field: "user_id",
					validation: "above",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.post(ADD_HABIT_SCOREBOARD_ITEM_URL)
			.send(payload)
			.loginVia(pam)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("user can only add their own habit scoreboard items", async ({client}) => {
	const jim = await User.find(users.jim.id);

	const payload = {
		name: "Wake up",
		score: HABIT_SCORE_TYPES.neutral,
		user_id: users.pam.id,
	};

	const response = await client
		.post(ADD_HABIT_SCOREBOARD_ITEM_URL)
		.send(payload)
		.loginVia(jim)
		.end();

	assertAccessDenied(response);
});
