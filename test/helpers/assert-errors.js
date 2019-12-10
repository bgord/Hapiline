const MAIN_ERROR_CODES = use("MAIN_ERROR_CODES");
const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

function assertInvalidSession(response) {
	response.assertStatus(401);
	response.assertJSON({
		code: MAIN_ERROR_CODES.invalid_session,
		message: MAIN_ERROR_MESSAGES.invalid_session,
		argErrors: [],
	});
}

function assertInvalidCredentials(response) {
	response.assertStatus(401);
	response.assertJSON({
		code: MAIN_ERROR_CODES.invalid_credentials,
		message: MAIN_ERROR_MESSAGES.invalid_credentials,
		argErrors: [],
	});
}

function assertAccessDenied(response) {
	response.assertStatus(403);
	response.assertJSON({
		code: MAIN_ERROR_CODES.access_denied,
		message: MAIN_ERROR_MESSAGES.access_denied,
		argErrors: [],
	});
}

function assertGuestOnly(response) {
	response.assertStatus(403);
	response.assertJSON({
		code: MAIN_ERROR_CODES.guest_only,
		message: MAIN_ERROR_MESSAGES.guest_only,
		argErrors: [],
	});
}

function assertInvalidToken(response) {
	response.assertStatus(400);
	response.assertJSON({
		code: MAIN_ERROR_CODES.invalid_request,
		message: MAIN_ERROR_MESSAGES.invalid_token,
		argErrors: [],
	});
}

function assertValidationError({response, argErrors}) {
	response.assertStatus(400);
	response.assertJSON({
		code: MAIN_ERROR_CODES.invalid_request,
		message: MAIN_ERROR_MESSAGES.invalid_request,
		argErrors,
	});
}

function assertUnprocessableEntity(response) {
	response.assertStatus(422);
	response.assertJSON({
		code: MAIN_ERROR_CODES.unprocessable_entity,
		message: MAIN_ERROR_MESSAGES.unprocessable_entity,
		argErrors: [],
	});
}

module.exports = {
	assertInvalidSession,
	assertAccessDenied,
	assertGuestOnly,
	assertInvalidToken,
	assertValidationError,
	assertInvalidCredentials,
	assertUnprocessableEntity,
};
