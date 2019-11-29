const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const VALIDATION_RULES = use("VALIDATION_RULES");
const SANITIZATION_RULES = use("SANITIZATION_RULES");
const BaseHttpValidator = use("BaseHttpValidator");

class StoreForgotPasswordIntention extends BaseHttpValidator {
	get rules() {
		return {
			email: VALIDATION_RULES.user.email,
		};
	}

	get messages() {
		return {
			"email.email": VALIDATION_MESSAGES.invalid_email,
			required: VALIDATION_MESSAGES.required,
		};
	}

	get sanitizationRules() {
		return {
			email: SANITIZATION_RULES.user.email,
		};
	}
}

module.exports = StoreForgotPasswordIntention;
