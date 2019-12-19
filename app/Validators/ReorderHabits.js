const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const BaseHttpValidator = use("BaseHttpValidator");

class StoreHabit extends BaseHttpValidator {
	get rules() {
		return {
			habits: "required|array",
			"habits.*.id": "required|integer|above:-1",
			"habits.*.index": "required|integer|above:-1",
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			"habits.array": VALIDATION_MESSAGES.array,
			integer: VALIDATION_MESSAGES.positive_integer_or_zero,
			above: VALIDATION_MESSAGES.positive_integer_or_zero,
		};
	}

	get sanitizationRules() {
		return {
			"habits.*.id": "toInt",
			"habits.*.index": "toInt",
		};
	}
}

module.exports = StoreHabit;
