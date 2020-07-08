const ace = require("@adonisjs/ace");
const datefns = require("date-fns");
const qs = require("qs");
const {
	assertAccessDenied,
	assertInvalidSession,
	assertValidationError,
} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");
const {test, trait, before, after} = use("Test/Suite")("Show journal");

const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

before(async () => {
	await ace.call("seed", {}, {silent: true});
});

after(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const GET_JORNAL_DAY_URL = "/api/v1/journal";

test("auth", async ({client}) => {
	const response = await client.get(GET_JORNAL_DAY_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(GET_JORNAL_DAY_URL)
		.loginVia(admin)
		.end();
	assertAccessDenied(response);
});

test("account-status:(active)", async ({client}) => {
	const pam = await User.find(users.pam.id);
	pam.merge({
		account_status: ACCOUNT_STATUSES.pending,
	});
	await pam.save();
	const response = await client
		.get(GET_JORNAL_DAY_URL)
		.loginVia(pam)
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
					message: VALIDATION_MESSAGES.required("day"),
					field: "day",
					validation: "required",
				},
			],
		],
		[
			{day: "xxx"},
			[
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
			{day: datefns.addDays(new Date(), 5)},
			[
				{
					message: VALIDATION_MESSAGES.before("day", "tomorrow"),
					field: "day",
					validation: "before",
				},
			],
		],
	];

	for (const [payload, argErrors] of cases) {
		const queryString = qs.stringify(payload);
		const response = await client
			.get(`${GET_JORNAL_DAY_URL}?${queryString}`)
			.loginVia(jim)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("full flow", async ({client, assert}) => {
	const jim = await User.find(users.jim.id);
	const today = datefns.format(new Date(), "yyyy-MM-dd");

	const payload = {day: today};

	const queryString = qs.stringify(payload);

	const response = await client
		.get(`${GET_JORNAL_DAY_URL}?${queryString}`)
		.send(payload)
		.loginVia(jim)
		.end();

	response.assertStatus(200);
	assert.equal(response.body.user_id, jim.id);
	assert.equal(response.body.content, "10 lorem ipsumlorem ipsum");
	assert.ok(datefns.isEqual(datefns.parseISO(response.body.day), datefns.parseISO(today)));
});
