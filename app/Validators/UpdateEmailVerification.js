const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const VALIDATION_RULES = use("VALIDATION_RULES");
const SANITIZATION_RULES = use("SANITIZATION_RULES");
const BaseHttpValidator = use("BaseHttpValidator");

class UpdateRegistrationIntention extends BaseHttpValidator {
	get rules() {
		return {
			token: VALIDATION_RULES.token,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required("token"),
			"token.max": VALIDATION_MESSAGES.max("token", 255),
		};
	}

	get sanitizationRules() {
		return {
			token: SANITIZATION_RULES.token,
		};
	}
}

module.exports = UpdateRegistrationIntention;
