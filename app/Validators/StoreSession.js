const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const VALIDATION_RULES = use("VALIDATION_RULES");
const SANITIZATION_RULES = use("SANITIZATION_RULES");
const BaseHttpValidator = use("BaseHttpValidator");

class StoreSession extends BaseHttpValidator {
	get rules() {
		return {
			email: VALIDATION_RULES.user.email,
			password: VALIDATION_RULES.user.password,
		};
	}

	get messages() {
		return {
			"email.email": VALIDATION_MESSAGES.invalid_email,
			required: VALIDATION_MESSAGES.required,
			"password.min": VALIDATION_MESSAGES.min("password", 6),
		};
	}

	get sanitizationRules() {
		return {
			email: SANITIZATION_RULES.user.email,
		};
	}
}

module.exports = StoreSession;
