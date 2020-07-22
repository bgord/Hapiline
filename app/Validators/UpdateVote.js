const datefns = require("date-fns");

const BaseHttpValidator = use("BaseHttpValidator");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class UpdateVote extends BaseHttpValidator {
	get rules() {
		const tomorrow = datefns.addDays(new Date(), 1);
		const weekAgo = datefns.subDays(new Date(), 7);

		return {
			habit_id: "required|integer|above:0|exists:habits,id",
			vote: `in:${Object.keys(HABIT_VOTE_TYPES)}`,
			day: `required|date|before:${tomorrow}|after:${weekAgo}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			integer: VALIDATION_MESSAGES.integer,
			date: VALIDATION_MESSAGES.date,
			"habit_id.above": VALIDATION_MESSAGES.above("habit_id", 0),
			"habit_id.exists": VALIDATION_MESSAGES.non_existent_resource("habit_id"),
			"vote.in": VALIDATION_MESSAGES.invalid_vote,
			"day.before": VALIDATION_MESSAGES.before("day", "tomorrow"),
			"day.after": VALIDATION_MESSAGES.after("day", "7 days ago"),
		};
	}

	get sanitizationRules() {
		return {
			habit_id: "toInt",
			vote: "toNull",
		};
	}
}

module.exports = UpdateVote;
