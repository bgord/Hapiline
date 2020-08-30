const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

const BaseHttpValidator = use("BaseHttpValidator");

class ShowMonth extends BaseHttpValidator {
	get rules() {
		return {
			monthOffset: "required|number|above:-1",
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			number: VALIDATION_MESSAGES.above("monthOffset", -1),
			above: VALIDATION_MESSAGES.above("monthOffset", -1),
		};
	}

	get sanitizationRules() {
		return {
			monthOffset: "toInt",
		};
	}
}

module.exports = ShowMonth;
