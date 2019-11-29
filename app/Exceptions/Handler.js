/* eslint-disable no-console */

const BaseExceptionHandler = use("BaseExceptionHandler");
const EXCEPTION_MESSAGES = use("EXCEPTION_MESSAGES");
const MAIN_ERROR_CODES = use("MAIN_ERROR_CODES");
const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

const URL_TO_INTERNAL_SERVER_ERROR = {
	"/api/v1/login": "Login failed, try again later.",
};

class ExceptionHandler extends BaseExceptionHandler {
	async handle(error, {request, response}) {
		const url = request.url();

		if (error.name === "InvalidTokenException") {
			return response.status(error.status).send({
				code: MAIN_ERROR_CODES.invalid_request,
				message: EXCEPTION_MESSAGES.InvalidTokenException(url, error.message),
				argErrors: [],
			});
		}
		if (error.name === "ValidationException") {
			return response.status(error.status).send({
				code: MAIN_ERROR_CODES.invalid_request,
				message: MAIN_ERROR_MESSAGES.invalid_request,
				argErrors: error.messages,
			});
		}
		if (error.name === "InvalidSessionException") {
			return response.status(error.status).send({
				code: MAIN_ERROR_CODES.invalid_session,
				message: EXCEPTION_MESSAGES.InvalidSessionException(url, error.message),
				argErrors: [],
			});
		}
		if (error.name === "HttpException") {
			return response.status(error.status).send({
				code: MAIN_ERROR_CODES.guest_only,
				message: EXCEPTION_MESSAGES.HttpException(url, error.message),
				argErrors: [],
			});
		}
		if (error.name === "ForbiddenException") {
			return response.status(error.status).send({
				code: MAIN_ERROR_CODES.access_denied,
				message: MAIN_ERROR_MESSAGES.access_denied,
				argErrors: [],
			});
		}
		console.log("=================");
		console.log(`UNEXPECTED ERROR for URL ${url}`);
		console.error(error);
		console.log("=================");
		console.log({
			status: error.status,
			name: error.name,
			message: error.message,
		});
		console.log("=================\n\n");
		return response.internalSeverError({
			message:
				URL_TO_INTERNAL_SERVER_ERROR[url] ||
				"Unexpected error, try again later.",
		});
	}

	/**
	 * Report exception for logging or debugging.
	 *
	 * @method report
	 *
	 * @param  {Object} error
	 * @param  {Object} options.request
	 *
	 * @return {void}
	 */
	// async report(error, {request}) {}
}

module.exports = ExceptionHandler;
