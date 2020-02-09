const ace = require("@adonisjs/ace");

const {
	assertAccessDenied,
	assertInvalidSession,
	assertValidationError,
} = require("../helpers/assert-errors");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Update User Email");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const Env = use("Env");
const MAIL_TEMPLATES = use("MAIL_TEMPLATES");
const Mail = use("Mail");
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

const CHANGE_EMAIL_URL = "/api/v1/change-email";

test("/change-email --- validation", async ({client}) => {
	const user = await User.find(2);
	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("newEmail"),
					field: "newEmail",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("password"),
					field: "password",
					validation: "required",
				},
			],
		],
		[
			{newEmail: "example@", password: "12345"},
			[
				{
					message: VALIDATION_MESSAGES.invalid_email,
					field: "newEmail",
					validation: "email",
				},
				{
					message: VALIDATION_MESSAGES.min("password", 6),
					field: "password",
					validation: "min",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.post(CHANGE_EMAIL_URL)
			.send(payload)
			.loginVia(user)
			.end();
		assertValidationError({
			response,
			argErrors,
		});
	}
});

test("/change-email --- auth restriction", async ({client}) => {
	const payload = {
		newEmail: "new@example.com",
		password: "!@#$%^",
	};

	const response = await client
		.post(CHANGE_EMAIL_URL)
		.send(payload)
		.end();
	assertInvalidSession(response);
});

test("/change-email --- active account status", async ({client}) => {
	const payload = {
		newEmail: "new@example.com",
		password: "!@#$%^",
	};

	const user = await User.find(2);

	const response = await client
		.post(CHANGE_EMAIL_URL)
		.send(payload)
		.loginVia(user)
		.end();
	assertAccessDenied(response);
});

test("/change-email --- password authentication", async ({client}) => {
	const user = await User.find(2);

	const payload = {
		newEmail: "harry@example.com",
		password: "1234567",
	};

	const response = await client
		.post(CHANGE_EMAIL_URL)
		.send(payload)
		.loginVia(user)
		.end();

	assertAccessDenied(response);
});

test("/change-email --- full flow", async ({client, assert}) => {
	Mail.fake();

	const user = await User.find(2);

	const oldEmail = "jim@example.com";
	const newEmail = "harry@example.com";

	const payload = {
		newEmail,
		password: "123456",
	};

	assert.equal(user.email, oldEmail);

	const response = await client
		.post(CHANGE_EMAIL_URL)
		.send(payload)
		.loginVia(user)
		.end();

	response.assertStatus(200);

	const userAfterUpdate = await User.find(2);
	assert.equal(userAfterUpdate.email, newEmail);
	assert.equal(userAfterUpdate.account_status, ACCOUNT_STATUSES.pending);

	const {message} = Mail.pullRecent();

	assert.deepEqual(message.subject, MAIL_TEMPLATES.newEmailAddressVerification.subject);

	assert.include(message.html, "Confirm your email address");

	assert.deepEqual(message.to[0].address, newEmail);
	assert.deepEqual(message.from.address, Env.get("MAIL_FROM"));

	const token = message.html.split("\n")[16].split("/")[4];

	const emailVerificationResponse = await client
		.post("/api/v1/verify-email")
		.send({token: decodeURIComponent(token)})
		.end();

	emailVerificationResponse.assertStatus(200);

	const userAfterVerification = await User.find(2);
	assert.equal(userAfterVerification.email, newEmail);
	assert.equal(userAfterVerification.account_status, ACCOUNT_STATUSES.active);

	const newEmailLoginResponse = await client
		.post("/api/v1/login")
		.send({
			email: newEmail,
			password: payload.password,
		})
		.end();

	newEmailLoginResponse.assertStatus(200);

	Mail.restore();
});
