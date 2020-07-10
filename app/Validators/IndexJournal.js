const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

const BaseHttpValidator = use("BaseHttpValidator");
const SORT_JOURNAL_BY_OPTIONS = use("SORT_JOURNAL_BY_OPTIONS");

class ShowMonth extends BaseHttpValidator {
	get rules() {
		return {
			sort: `required|in:${Object.keys(SORT_JOURNAL_BY_OPTIONS)}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			in: VALIDATION_MESSAGES.invalid_sort_by_option,
		};
	}
}

module.exports = ShowMonth;
