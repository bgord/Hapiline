const ace = require("@adonisjs/ace");

const {
	assertAccessDenied,
	assertInvalidSession,
	assertValidationError,
	assertInvalidCredentials,
} = require("../helpers/assert-errors");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")(
	"Update password",
);
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
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

const UPDATE_PASSWORD_URL = "/api/v1/update-password";

test("/update-password --- validation", async ({client}) => {
	const user = await User.find(1);
	const cases = [
		[
			{},
			[
				{
					message: VALIDATION_MESSAGES.required("old_password"),
					field: "old_password",
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
				old_password: "xx11",
				password: "xxx",
				password_confirmation: "xxx",
			},
			[
				{
					message: VALIDATION_MESSAGES.min("old_password", 6),
					field: "old_password",
					validation: "min",
				},
				{
					message: VALIDATION_MESSAGES.min("password", 6),
					field: "password",
					validation: "min",
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
				old_password: "xxxxxx",
				password: "xxxxxx",
				password_confirmation: "zzzzzz",
			},
			[
				{
					message: VALIDATION_MESSAGES.old_password,
					field: "old_password",
					validation: "different",
				},
				{
					message: VALIDATION_MESSAGES.password_confirmation,
					field: "password_confirmation",
					validation: "same",
				},
			],
		],
	];

	for (let [payload, argErrors] of cases) {
		const response = await client
			.patch(UPDATE_PASSWORD_URL)
			.send(payload)
			.loginVia(user)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("/update-password --- auth restrictions", async ({client}) => {
	const payload = {
		old_password: "xxxxxx",
		password: "yyyyyy",
		password_confirmation: "yyyyyy",
	};

	const response = await client
		.patch(UPDATE_PASSWORD_URL)
		.send(payload)
		.end();
	assertInvalidSession(response);
});

test("/update-password --- active account status", async ({client}) => {
	const payload = {
		old_password: "xxxxxx",
		password: "yyyyyy",
		password_confirmation: "yyyyyy",
	};

	const user = await User.find(1);

	user.merge({
		account_status: ACCOUNT_STATUSES.pending,
	});
	await user.save();

	const response = await client
		.patch(UPDATE_PASSWORD_URL)
		.send(payload)
		.loginVia(user)
		.end();
	assertAccessDenied(response);
});

test("/update-password --- full flow", async ({client}) => {
	const payload = {
		old_password: "123456",
		password: "xxxxxx",
		password_confirmation: "xxxxxx",
	};

	const user = await User.find(1);

	const updatePasswordResponse = await client
		.patch(UPDATE_PASSWORD_URL)
		.loginVia(user)
		.send(payload)
		.end();

	updatePasswordResponse.assertStatus(204);

	const successfulLoginResponse = await client
		.post("/api/v1/login")
		.send({
			email: "admin@example.com",
			password: payload.password,
		})
		.end();

	successfulLoginResponse.assertStatus(200);

	const unsuccessfulLoginResponse = await client
		.post("/api/v1/login")
		.send({
			email: "admin@example.com",
			password: payload.old_password,
		})
		.end();
	assertInvalidCredentials(unsuccessfulLoginResponse);
});
