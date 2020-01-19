const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

const BaseHttpValidator = use("BaseHttpValidator");

class IndexVoteComment extends BaseHttpValidator {
	get rules() {
		return {
			habitId: "required|number|above:0",
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			number: VALIDATION_MESSAGES.above("habitId", 0),
			above: VALIDATION_MESSAGES.above("habitId", 0),
		};
	}
}

module.exports = IndexVoteComment;
