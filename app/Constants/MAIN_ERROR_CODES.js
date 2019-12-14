const MAIN_ERROR_CODES = {
	guest_only: "E_GUEST_ONLY",
	access_denied: "E_ACCESS_DENIED",
	invalid_session: "E_INVALID_SESSION",
	invalid_request: "E_VALIDATION_FAILED",
	invalid_credentials: "E_INVALID_CREDENTIALS",
	internal_sever_error: "E_INTERNAL_SERVER_ERROR",
	unprocessable_entity: "E_UNPROCESSABLE_ENTITY",
	not_found: "E_NOT_FOUND",
};

module.exports = MAIN_ERROR_CODES;
