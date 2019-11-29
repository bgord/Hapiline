const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const VALIDATION_RULES = use("VALIDATION_RULES");
const SANITIZATION_RULES = use("SANITIZATION_RULES");
const BaseHttpValidator = use("BaseHttpValidator");

class StoreRegistrationIntention extends BaseHttpValidator {
	get rules() {
		return {
			email: `${VALIDATION_RULES.user.email}|unique:users,email`,
			password: VALIDATION_RULES.user.password,
			password_confirmation: VALIDATION_RULES.user.password_confirmation,
		};
	}

	get messages() {
		return {
			"email.email": VALIDATION_MESSAGES.invalid_email,
			required: VALIDATION_MESSAGES.required,
			"password_confirmation.same": VALIDATION_MESSAGES.password_confirmation,
			"email.unique": VALIDATION_MESSAGES.unique_email,
			"password.min": VALIDATION_MESSAGES.min("password", 6),
			"password_confirmation.min": VALIDATION_MESSAGES.min(
				"password_confirmation",
				6,
			),
		};
	}

	get sanitizationRules() {
		return {
			email: SANITIZATION_RULES.user.email,
		};
	}
}

module.exports = StoreRegistrationIntention;
