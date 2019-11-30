const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const BaseHttpValidator = use("BaseHttpValidator");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

class StoreHabitScoreboardItem extends BaseHttpValidator {
	get rules() {
		return {
			name: "required|string|max:255",
			score: `required|in:${Object.keys(HABIT_SCORE_TYPES)}`,
			user_id: "required|integer|above:0",
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			integer: VALIDATION_MESSAGES.integer,
			string: VALIDATION_MESSAGES.string,
			"name.max": VALIDATION_MESSAGES.max("name", 255),
			"score.in": VALIDATION_MESSAGES.invalid_score,
			"user_id.above": VALIDATION_MESSAGES.above("user_id", 0),
		};
	}

	get sanitizationRules() {
		return {
			name: "trim|escape",
			user_id: "toInt",
		};
	}
}

module.exports = StoreHabitScoreboardItem;
