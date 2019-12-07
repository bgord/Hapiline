const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

function getInvalidTokenExceptionMessage(url, originalErrorMessage) {
	const urlToMessage = {
		"/api/v1/verify-email": MAIN_ERROR_MESSAGES.invalid_token,
		"/api/v1/new-password": MAIN_ERROR_MESSAGES.invalid_token,
	};
	return urlToMessage[url] || originalErrorMessage;
}

function getInvalidSessionExceptionMessage() {
	return MAIN_ERROR_MESSAGES.invalid_session;
}

function getHttpExceptionMessage(url, originalErrorMessage) {
	const urlToMessage = {
		"/api/v1/login": guestOnlyOrOriginalMessage(originalErrorMessage),
		"/api/v1/register": guestOnlyOrOriginalMessage(originalErrorMessage),
		"/api/v1/verify-email": guestOnlyOrOriginalMessage(originalErrorMessage),
		"/api/v1/forgot-password": guestOnlyOrOriginalMessage(originalErrorMessage),
		"/api/v1/new-password": guestOnlyOrOriginalMessage(originalErrorMessage),
	};
	return urlToMessage[url] || originalErrorMessage;
}

const EXCEPTION_MESSAGES = {
	InvalidTokenException: getInvalidTokenExceptionMessage,
	InvalidSessionException: getInvalidSessionExceptionMessage,
	HttpException: getHttpExceptionMessage,
};

function guestOnlyOrOriginalMessage(originalErrorMessage) {
	return originalErrorMessage.startsWith("E_GUEST_ONLY")
		? MAIN_ERROR_MESSAGES.guest_only
		: originalErrorMessage;
}

module.exports = EXCEPTION_MESSAGES;
