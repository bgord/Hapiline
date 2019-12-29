const ace = require("@adonisjs/ace");

const {
	assertGuestOnly,
	assertInvalidToken,
	assertValidationError,
	assertInvalidCredentials,
} = require("../helpers/assert-errors");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Forgot password");
const Env = use("Env");
const MAIL_TEMPLATES = use("MAIL_TEMPLATES");
const Mail = use("Mail");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const _ = use("Utils");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const FORGOT_PASSWORD_URL = "/api/v1/forgot-password";
const NEW_PASSWORD_URL = "/api/v1/new-password";

test("/forgot-password --- validation", async ({client}) => {
	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("email"),
					field: "email",
					validation: "required",
				},
			],
		],
		[
			{
				email: "example@",
			},
			[
				{
					message: VALIDATION_MESSAGES.invalid_email,
					field: "email",
					validation: "email",
				},
			],
		],
	];

	for (let [data, argErrors] of cases) {
		const response = await client
			.post(FORGOT_PASSWORD_URL)
			.send(data)
			.end();

		assertValidationError({response, argErrors});
	}
});

test("/forgot-password --- auth restriction", async ({client}) => {
	const payload = {
		email: "unusual@example.com",
	};

	const user = await User.find(1);

	const response = await client
		.post(FORGOT_PASSWORD_URL)
		.loginVia(user)
		.send(payload)
		.end();
	assertGuestOnly(response);
});

test("/forgot-password --- send an email", async ({client, assert}) => {
	Mail.fake();

	const user = await User.find(1);

	const payload = {
		email: user.toJSON().email,
	};

	const response = await client
		.post(FORGOT_PASSWORD_URL)
		.send(payload)
		.end();

	await _.sleep(10);

	const email = Mail.pullRecent();

	assert.deepEqual(email.message.subject, MAIL_TEMPLATES.forgotPassword.subject);

	assert.deepEqual(email.message.subject, MAIL_TEMPLATES.forgotPassword.subject);

	assert.deepEqual(email.message.to[0].address, payload.email);
	assert.deepEqual(email.message.from.address, Env.get("MAIL_FROM"));

	response.assertStatus(204);

	Mail.restore();
});

test("/forgot-password --- full flow", async ({client}) => {
	Mail.fake();

	const user = await User.find(1);
	const userEmail = user.toJSON().email;

	const payload = {
		email: userEmail,
	};

	const newPassword = "654321";
	const oldPassword = "123456";

	const response = await client
		.post(FORGOT_PASSWORD_URL)
		.send(payload)
		.end();

	response.assertStatus(204);

	await _.sleep(10);
	const token = Mail.pullRecent()
		.message.html.split("\n")[16]
		.split("/")[4];

	const newPasswordResponse = await client
		.post(NEW_PASSWORD_URL)
		.send({
			token: decodeURIComponent(token),
			password: newPassword,
			password_confirmation: newPassword,
		})
		.end();

	newPasswordResponse.assertStatus(204);

	const newPasswordLoginResponse = await client
		.post("/api/v1/login")
		.send({email: userEmail, password: newPassword})
		.end();

	newPasswordLoginResponse.assertStatus(200);

	const oldPasswordLoginResponse = await client
		.post("/api/v1/login")
		.send({email: userEmail, password: oldPassword})
		.end();
	assertInvalidCredentials(oldPasswordLoginResponse);

	Mail.restore();
});

test("/forgot-password --- non-existent email", async ({client, assert}) => {
	Mail.fake();

	const payload = {
		email: "xxx@example.com",
	};

	const response = await client
		.post(FORGOT_PASSWORD_URL)
		.send(payload)
		.end();

	response.assertStatus(204);

	const emails = Mail.pullRecent();
	assert.equal(emails, undefined);

	Mail.restore();
});

test("/new-password --- validation", async ({client}) => {
	const threeHundredChars = Array.from({length: 300})
		.map(() => "a")
		.join("");

	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("token"),
					field: "token",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("password"),
					field: "password",
					validation: "required",
				},
				{
					message: VALIDATION_MESSAGES.required("password_confirmation"),
					field: "password_confirmation",
					validation: "required",
				},
			],
		],
		[
			{
				token: threeHundredChars,
				password: "123",
				password_confirmation: "12345",
			},
			[
				{
					message: VALIDATION_MESSAGES.max("token", 255),
					field: "token",
					validation: "max",
				},
				{
					message: VALIDATION_MESSAGES.min("password", 6),
					field: "password",
					validation: "min",
				},
				{
					message: VALIDATION_MESSAGES.password_confirmation,
					field: "password_confirmation",
					validation: "same",
				},
				{
					message: VALIDATION_MESSAGES.min("password_confirmation", 6),
					field: "password_confirmation",
					validation: "min",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.post(NEW_PASSWORD_URL)
			.send(payload)
			.end();
		assertValidationError({
			response,
			argErrors,
		});
	}
});

test("/new-password --- invalid token", async ({client}) => {
	const payload = {
		token: "xxx",
		password: "123456",
		password_confirmation: "123456",
	};

	const response = await client
		.post(NEW_PASSWORD_URL)
		.send(payload)
		.end();
	assertInvalidToken(response);
});

test("/new-password --- auth restrictions", async ({client}) => {
	const payload = {
		token: "xxx",
		password: "yyyyyy",
		password_confirmation: "yyyyyy",
	};

	const user = await User.find(1);

	const response = await client
		.post(NEW_PASSWORD_URL)
		.loginVia(user)
		.send(payload)
		.end();
	assertGuestOnly(response);
});
