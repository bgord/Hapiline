const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");
const HABIT_STRENGTH_TYPES = use("HABIT_STRENGTH_TYPES");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const HABIT_VOTE_CHART_DATE_RANGE = use("HABIT_VOTE_CHART_DATE_RANGE");
const NOTIFICATION_STATUSES = use("NOTIFICATION_STATUSES");

const VALIDATION_MESSAGES = {
	invalid_email: "Invalid email address.",
	required: field => `Field ${field} is required.`,
	password_confirmation: `Passwords must be the same.`,
	unique_email: `Given email address already exists.`,
	min: (field, min) => `Field ${field} must be at least ${min} chars long.`,
	max: (field, max) => `Field ${field} must be at most ${max} chars long.`,
	old_password: `Old password cannot be the same as the new password.`,
	invalid_score: `Score must be one of ${Object.keys(HABIT_SCORE_TYPES).join(", ")}.`,
	invalid_strength: `Strength must be one of ${Object.keys(HABIT_STRENGTH_TYPES).join(", ")}.`,
	integer: field => `Field ${field} must be an integer.`,
	string: field => `Field ${field} must be a string.`,
	above: (field, number) => `Field ${field} must be above ${number}.`,
	unique_habit: `Given habit already exists.`,
	array: field => `${field} must be an array.`,
	positive_integer_or_zero: field => `${field} must be positive integer or 0.`,
	invalid_vote: `Vote must be one of ${Object.keys(HABIT_VOTE_TYPES).join(", ")} or null.`,
	non_existent_resource: field => `Resource ${field} doesn't exist.`,
	date: field => `Field ${field} must be a date.`,
	before: (field, beforeDate) => `Field ${field} must be before ${beforeDate}.`,
	after: (field, after) => `Field ${field} must be after ${after}.`,
	invalid_habit_vote_chart_date_range: `habitVoteChartDateRange must one of ${Object.keys(
		HABIT_VOTE_CHART_DATE_RANGE,
	).join(", ")}.`,
	invalid_comment: "Comment must be max of 1024 characters.",
	invalid_description: "Description must be max of 1024 characters.",
	boolean: field => `${field} must be true or false.`,
	invalid_notification_status: `Notification status must be one of: ${Object.keys(
		NOTIFICATION_STATUSES,
	)}`,
	same_or_after: (field, sameOrAfterDay) =>
		`Field ${field} must be same as or after ${sameOrAfterDay}.`,
};

module.exports = VALIDATION_MESSAGES;
