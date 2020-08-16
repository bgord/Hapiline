/* eslint-disable max-params */

const {hooks} = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
	const Database = use("Database");
	const Response = use("Adonis/Src/Response");
	const MAIN_ERROR_MESSAGES = use("App/Constants/MAIN_ERROR_MESSAGES");
	const MAIN_ERROR_CODES = use("App/Constants/MAIN_ERROR_CODES");
	const Validator = use("Validator");

	// RESPONSE MACROS
	Response.macro("accessDenied", function() {
		this.status(403).send({
			code: MAIN_ERROR_CODES.access_denied,
			message: MAIN_ERROR_MESSAGES.access_denied,
			argErrors: [],
		});
	});

	Response.macro("inactiveAccount", function() {
		this.status(403).send({
			code: MAIN_ERROR_CODES.access_denied,
			message: MAIN_ERROR_MESSAGES.inactive_account,
			argErrors: [],
		});
	});

	Response.macro("invalidCredentials", function() {
		this.status(401).send({
			code: MAIN_ERROR_CODES.invalid_credentials,
			message: MAIN_ERROR_MESSAGES.invalid_credentials,
			argErrors: [],
		});
	});

	Response.macro("validationError", function({
		message = MAIN_ERROR_MESSAGES.invalid_request,
		argErrors = [],
	}) {
		this.status(400).send({
			code: MAIN_ERROR_CODES.invalid_request,
			message,
			argErrors,
		});
	});

	Response.macro("notFound", function() {
		this.status(404).send({
			code: MAIN_ERROR_CODES.not_found,
			message: MAIN_ERROR_MESSAGES.not_found,
			argErrors: [],
		});
	});

	Response.macro("unprocessableEntity", function() {
		this.status(422).send({
			code: MAIN_ERROR_CODES.unprocessable_entity,
			message: MAIN_ERROR_MESSAGES.unprocessable_entity,
			argErrors: [],
		});
	});

	Response.macro("internalSeverError", function({message}) {
		this.status(500).send({
			code: MAIN_ERROR_CODES.internal_sever_error,
			message,
			argErrors: [],
		});
	});

	Validator.extend("exists", async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value || !Number.isInteger(value) || value <= 0) {
			/**
			 * Skip validation if value is not defined, `required` rule should take care of it.
			 * Skip validation if value is not an integer, `integer` rule should take care of it.
			 */
			return;
		}

		const [table, column] = args;
		const row = await Database.table(table)
			.where(column, value)
			.first();

		if (!row) {
			throw message;
		}
	});
});
