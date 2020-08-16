const ace = require("@adonisjs/ace");

const {
	assertGuestOnly,
	assertInvalidSession,
	assertValidationError,
	assertInvalidCredentials,
	assertInactiveAccount,
} = require("../helpers/assert-errors");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Login");
const User = use("User");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const LOGIN_URL = "/api/v1/login";

test("/login --- validation", async ({client}) => {
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
			],
		],
		[
			{
				email: "example@",
				password: "12345",
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
			],
		],
	];

	for (let [data, argErrors] of cases) {
		const response = await client
			.post(LOGIN_URL)
			.send(data)
			.end();
		assertValidationError({response, argErrors});
	}
});

test("/login --- auth restrictions (guest only)", async ({client}) => {
	const payload = {
		email: "jim@example.com",
		password: "yyyyyy",
	};

	const user = await User.find(1);

	const response = await client
		.post(LOGIN_URL)
		.send(payload)
		.loginVia(user)
		.end();
	assertGuestOnly(response);
});

test("/login --- auth restrictions (active account status)", async ({client}) => {
	const user = await User.findBy("email", "jim@example.com");

	user.merge({account_status: ACCOUNT_STATUSES.deleted});
	await user.save();

	const payload = {email: user.email, password: "123456"};

	const deletedAccountResponse = await client
		.post(LOGIN_URL)
		.send(payload)
		.end();

	assertInactiveAccount(deletedAccountResponse);

	user.merge({account_status: ACCOUNT_STATUSES.pending});
	await user.save();

	const pendingAccountResponse = await client
		.post(LOGIN_URL)
		.send(payload)
		.end();

	assertInactiveAccount(pendingAccountResponse);
});

test("/login --- full flow", async ({client}) => {
	const user = await User.find(1);

	const response = await client
		.get("/app")
		.loginVia(user)
		.end();

	response.assertStatus(200);
	response.assertJSON({
		message: "Hello from the inside, admin@example.com.",
	});
});

test("/login --- invalid credentials", async ({client}) => {
	const payload = {
		email: "valid@example.com",
		password: "654321",
	};

	const response = await client
		.post(LOGIN_URL)
		.send(payload)
		.end();

	assertInvalidCredentials(response);
});

test("user CANNOT access dashboard after login", async ({client}) => {
	const response = await client.get("/app").end();
	assertInvalidSession(response);
});

test("/logout --- auth restrictions", async ({client}) => {
	const response = await client.post("/api/v1/logout").end();
	assertInvalidSession(response);
});

test("/logout --- full flow", async ({client}) => {
	const user = await User.findBy("email", "admin@example.com");

	const response = await client
		.post("/api/v1/logout")
		.loginVia(user)
		.end();

	response.assertStatus(200);
});

test("/login --- user profile is returned after on a successful response", async ({
	client,
	assert,
}) => {
	const payload = {
		email: "jim@example.com",
		password: "123456",
	};

	const response = await client
		.post("/api/v1/login")
		.send(payload)
		.end();

	response.assertStatus(200);
	response.assertJSONSubset({
		account_status: ACCOUNT_STATUSES.active,
		email: payload.email,
		id: 2,
	});
	assert.exists(response.body.created_at);
	assert.exists(response.body.updated_at);
});
