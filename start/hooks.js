const {hooks} = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
	const Response = use("Adonis/Src/Response");
	const MAIN_ERROR_MESSAGES = use("App/Constants/MAIN_ERROR_MESSAGES");
	const MAIN_ERROR_CODES = use("App/Constants/MAIN_ERROR_CODES");

	// RESPONSE MACROS
	Response.macro("accessDenied", function() {
		this.status(403).send({
			code: MAIN_ERROR_CODES.access_denied,
			message: MAIN_ERROR_MESSAGES.access_denied,
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
});
