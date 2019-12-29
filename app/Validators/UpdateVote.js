const BaseHttpValidator = use("BaseHttpValidator");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

class UpdateVote extends BaseHttpValidator {
	get rules() {
		return {
			habit_id: "required|integer|above:0",
			vote: `in:${Object.keys(HABIT_VOTE_TYPES)}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			integer: VALIDATION_MESSAGES.integer,
			"habit_id.above": VALIDATION_MESSAGES.above("habit_id", 0),
			"vote.in": VALIDATION_MESSAGES.invalid_vote,
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
