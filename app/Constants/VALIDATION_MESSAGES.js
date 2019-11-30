const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

const VALIDATION_MESSAGES = {
	invalid_email: "Invalid email address.",
	required: field => `Field ${field} is required.`,
	password_confirmation: `Passwords must be the same.`,
	unique_email: `Given email address already exists.`,
	min: (field, min) => `Field ${field} must be at least ${min} chars long.`,
	max: (field, max) => `Field ${field} must be at most ${max} chars long.`,
	old_password: `Old password cannot be the same as the new password.`,
	invalid_score: `Score must be one of ${Object.keys(HABIT_SCORE_TYPES)}.`,
	integer: field => `Field ${field} must be an integer.`,
	string: field => `Field ${field} must be a string.`,
	above: (field, number) => `Field ${field} must be above ${number}.`,
	unique_habitscoreboard_item: `Given habit already exists.`,
};

module.exports = VALIDATION_MESSAGES;
