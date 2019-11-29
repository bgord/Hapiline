const VALIDATION_RULES = use("VALIDATION_RULES");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const SANITIZATION_RULES = use("SANITIZATION_RULES");

const BaseHttpValidator = use("BaseHttpValidator");

class UpdateUserEmail extends BaseHttpValidator {
	get rules() {
		return {
			newEmail: VALIDATION_RULES.user.email,
			password: VALIDATION_RULES.user.password,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			"newEmail.email": VALIDATION_MESSAGES.invalid_email,
			"password.min": VALIDATION_MESSAGES.min("password", 6),
		};
	}

	get sanitizationRules() {
		return {
			newEmail: SANITIZATION_RULES.user.email,
		};
	}
}

module.exports = UpdateUserEmail;
