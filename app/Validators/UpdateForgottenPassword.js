const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const VALIDATION_RULES = use("VALIDATION_RULES");
const SANITIZATION_RULES = use("SANITIZATION_RULES");
const BaseHttpValidator = use("BaseHttpValidator");

class UpdateForgotPasswordIntention extends BaseHttpValidator {
	get rules() {
		return {
			token: VALIDATION_RULES.token,
			password: VALIDATION_RULES.user.password,
			password_confirmation: VALIDATION_RULES.user.password_confirmation,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			"token.max": VALIDATION_MESSAGES.max("token", 255),
			"password.min": VALIDATION_MESSAGES.min("password", 6),
			"password_confirmation.min": VALIDATION_MESSAGES.min("password_confirmation", 6),
			"password_confirmation.same": VALIDATION_MESSAGES.password_confirmation,
		};
	}

	get sanitizationRules() {
		return {
			token: SANITIZATION_RULES.token,
		};
	}
}

module.exports = UpdateForgotPasswordIntention;
