const MAIN_ERROR_MESSAGES = {
	invalid_request: "Invalid request.",
	invalid_token: "Invalid token.",
	access_denied: "Access denied.",
	invalid_session: "You're not logged in.",
	guest_only: "Guest only.",
	invalid_credentials: "Invalid email or password.",
	unprocessable_entity: "Resource doesn't exist",
	not_found: "Resource not found.",
	not_all_habit_ids_supplied: "You have to supply all habit ids.",
	indexes_out_of_order: "Invalid indexes order.",
	cannot_reorder_habits: "Cannot reorder habits.",
	inactive_account: "Inactive account.",
};

module.exports = MAIN_ERROR_MESSAGES;
