const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const BaseHttpValidator = use("BaseHttpValidator");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

class UpdateHabit extends BaseHttpValidator {
	get rules() {
		return {
			name: "string|max:255",
			score: `in:${Object.keys(HABIT_SCORE_TYPES)}`,
		};
	}

	get messages() {
		return {
			string: VALIDATION_MESSAGES.string,
			"name.max": VALIDATION_MESSAGES.max("name", 255),
			"score.in": VALIDATION_MESSAGES.invalid_score,
		};
	}

	get sanitizationRules() {
		return {
			name: "trim|escape",
		};
	}
}

module.exports = UpdateHabit;
