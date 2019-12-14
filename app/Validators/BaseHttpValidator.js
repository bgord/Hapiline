const MAIN_ERROR_CODES = use("MAIN_ERROR_CODES");
const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

class BaseHttpValidator {
	get validateAll() {
		return true;
	}

	async fails(errorMessages) {
		// In case some of the validators throws a db related error
		// it's safer to just return a 500 than expose query details.
		const engineException = errorMessages.find(
			error => error.validation === "ENGINE_EXCEPTION",
		);
		if (engineException) {
			/* eslint-disable no-console */
			console.log(engineException);
			return this.ctx.response.internalSeverError({
				message: "Unexpected error, try again later.",
			});
		}
		return this.ctx.response.status(400).json({
			code: MAIN_ERROR_CODES.invalid_request,
			message: MAIN_ERROR_MESSAGES.invalid_request,
			argErrors: errorMessages,
		});
	}
}

module.exports = BaseHttpValidator;
