const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

const BaseHttpValidator = use("BaseHttpValidator");

class UpdateVoteComment extends BaseHttpValidator {
	get rules() {
		return {
			comment: "string|max:1024",
		};
	}

	get messages() {
		return {
			string: VALIDATION_MESSAGES.invalid_comment,
			max: VALIDATION_MESSAGES.invalid_comment,
		};
	}

	get sanitizationRules() {
		return {
			comment: "to_null",
		};
	}
}

module.exports = UpdateVoteComment;
