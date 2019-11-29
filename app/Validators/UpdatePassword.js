const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const VALIDATION_RULES = use("VALIDATION_RULES");
const BaseHttpValidator = use("BaseHttpValidator");

class UpdatePassword extends BaseHttpValidator {
	get rules() {
		return {
			old_password: VALIDATION_RULES.user.old_password,
			password: VALIDATION_RULES.user.password,
			password_confirmation: VALIDATION_RULES.user.password_confirmation,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			"password_confirmation.same": VALIDATION_MESSAGES.password_confirmation,
			"old_password.different": VALIDATION_MESSAGES.old_password,
			"password.min": VALIDATION_MESSAGES.min("password", 6),
			"old_password.min": VALIDATION_MESSAGES.min("old_password", 6),
			"password_confirmation.min": VALIDATION_MESSAGES.min(
				"password_confirmation",
				6,
			),
		};
	}
}

module.exports = UpdatePassword;
