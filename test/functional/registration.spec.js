const ace = require("@adonisjs/ace");

const {
	assertGuestOnly,
	assertInvalidToken,
	assertValidationError,
} = require("../helpers/assert-errors");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Registration");
const Env = use("Env");
const MAIL_TEMPLATES = use("MAIL_TEMPLATES");
const Mail = use("Mail");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const _ = use("Utils");
const ROLE_NAMES = use("ROLE_NAMES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const REGISTER_URL = "/api/v1/register";
const VERIFY_EMAIL_URL = "/api/v1/verify-email";

test("/register --- validation", async ({client}) => {
	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("email"),
					field: "email",
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
				email: "example@",
				password: "1234",
				password_confirmation: "12345",
			},
			[
				{
					message: VALIDATION_MESSAGES.invalid_email,
					field: "email",
					validation: "email",
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
		[
			{
				email: "admin@example.com",
				password: "123456",
				password_confirmation: "123456",
			},
			[
				{
					message: VALIDATION_MESSAGES.unique_email,
					field: "email",
					validation: "unique",
				},
			],
		],
	];

	for (let [data, argErrors] of cases) {
		const response = await client
			.post(REGISTER_URL)
			.send(data)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("/register --- auth restrictions", async ({client}) => {
	const payload = {
		email: "example@example.com",
		password: "123456",
		password_confirmation: "123456",
	};

	const user = await User.find(1);

	const response = await client
		.post(REGISTER_URL)
		.loginVia(user)
		.send(payload)
		.end();
	assertGuestOnly(response);
});

test("/register --- full flow", async ({client, assert}) => {
	Mail.fake();
	const newUser = {
		email: "new@example.com",
		password: "123456",
		password_confirmation: "123456",
	};

	const response = await client
		.post(REGISTER_URL)
		.send(newUser)
		.end();

	response.assertStatus(200);

	// Flushing pending promises here.
	// Without this line, email from the
	// user::created event handler is not
	// registered as sent.
	await _.sleep(10);

	const email = Mail.pullRecent();

	assert.deepEqual(email.message.subject, MAIL_TEMPLATES.registration.subject);

	assert.include(email.message.html, "Welcome to our service");

	assert.deepEqual(email.message.to[0].address, newUser.email);
	assert.deepEqual(email.message.from.address, Env.get("MAIL_FROM"));

	Mail.restore();

	const token = email.message.html.split("\n")[16].split("/")[4];

	const emailVerificationResponse = await client
		.post(VERIFY_EMAIL_URL)
		.send({token: decodeURIComponent(token)})
		.end();
	emailVerificationResponse.assertStatus(200);

	const user = await User.findBy("email", newUser.email);
	const [role] = await user.getRoles();

	assert.equal(role, ROLE_NAMES.regular);

	const appResponse = await client
		.get("/app")
		.loginVia(user)
		.end();

	appResponse.assertStatus(200);
	appResponse.assertJSON({
		message: `Hello from the inside, ${newUser.email}.`,
	});
});

test("/verify-email --- validation", async ({client}) => {
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
			],
		],
		[
			{
				token: threeHundredChars,
			},
			[
				{
					message: VALIDATION_MESSAGES.max("token", 255),
					field: "token",
					validation: "max",
				},
			],
		],
	];

	for (let [data, argErrors] of cases) {
		const response = await client
			.post(VERIFY_EMAIL_URL)
			.send(data)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("/verify-email --- invalid token", async ({client}) => {
	const payload = {
		token: "invalid_token",
	};

	const response = await client
		.post(VERIFY_EMAIL_URL)
		.send(payload)
		.end();
	assertInvalidToken(response);
});

test("/verify-email --- auth restriction", async ({client}) => {
	const payload = {
		token: "xxx",
	};

	const user = await User.find(1);

	const response = await client
		.post(VERIFY_EMAIL_URL)
		.loginVia(user)
		.send(payload)
		.end();

	assertGuestOnly(response);
});
