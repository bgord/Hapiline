const {test, trait, before, after} = use("Test/Suite")("Get month");
const ace = require("@adonisjs/ace");
const User = use("User");
const {
	assertInvalidSession,
	assertAccessDenied,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const qs = require("qs");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const datefns = require("date-fns");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

before(async () => {
	await ace.call("seed", {}, {silent: true});
});

after(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const GET_MONTH_URL = "/api/v1/month";

const thisMonth = 0;

test("auth", async ({client}) => {
	const response = await client.get(`${GET_MONTH_URL}?monthOffset=${thisMonth}`).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(`${GET_MONTH_URL}?monthOffset=${thisMonth}`)
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
		.get(`${GET_MONTH_URL}?monthOffset=${thisMonth}`)
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
					message: VALIDATION_MESSAGES.required("monthOffset"),
					field: "monthOffset",
					validation: "required",
				},
			],
		],
		[
			{monthOffset: "xxx"},
			[
				{
					message: VALIDATION_MESSAGES.above("monthOffset", -1),
					field: "monthOffset",
					validation: "number",
				},
				{
					message: VALIDATION_MESSAGES.above("monthOffset", -1),
					field: "monthOffset",
					validation: "above",
				},
			],
		],
		[
			{monthOffset: -1},
			[
				{
					message: VALIDATION_MESSAGES.above("monthOffset", -1),
					field: "monthOffset",
					validation: "above",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const queryString = qs.stringify(payload);

		const response = await client
			.get(`${GET_MONTH_URL}?${queryString}`)
			.loginVia(pam)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("full flow", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const payload = {monthOffset: 0};

	const queryString = qs.stringify(payload);

	const response = await client
		.get(`${GET_MONTH_URL}?${queryString}`)
		.loginVia(pam)
		.end();

	const now = Date.now();

	const today = datefns.format(now, "yyyy-MM-dd");

	const yesterday = datefns.format(datefns.subDays(new Date(today), 1), "yyyy-MM-dd");

	const theDayBeforeYesterday = datefns.format(datefns.subDays(new Date(today), 2), "yyyy-MM-dd");

	assert.deepEqual(response.body, [
		{day: theDayBeforeYesterday, count: 6},
		{day: yesterday, count: 7},
		{day: today, count: 7},
	]);
});

test("month with no entries", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const payload = {monthOffset: 1};

	const queryString = qs.stringify(payload);

	const response = await client
		.get(`${GET_MONTH_URL}?${queryString}`)
		.loginVia(pam)
		.end();

	assert.deepEqual(response.body, []);
});
