const ace = require("@adonisjs/ace");

const {assertInvalidSession} = require("../helpers/assert-errors");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Me");
const User = use("User");
const datefns = require("date-fns");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

test("/me --- auth restrictions", async ({client}) => {
	const response = await client.get("/api/v1/me").end();
	assertInvalidSession(response);
});

test("/me --- full flow", async ({client, assert}) => {
	const user = await User.find(1);

	const response = await client
		.get("/api/v1/me")
		.loginVia(user)
		.end();
	response.assertStatus(200);

	assert.equal(response.body.email, user.email);
	assert.equal(response.body.id, user.id);
	assert.ok(datefns.isEqual(user.created_at, datefns.parseISO(response.body.created_at)));
});
