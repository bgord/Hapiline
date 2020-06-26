const datefns = require("date-fns");

const BaseHttpValidator = use("BaseHttpValidator");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class StoreJournal extends BaseHttpValidator {
	get rules() {
		const tomorrow = datefns.addDays(new Date(), 1);

		return {
			day: `required|date|before:${tomorrow}`,
			content: `string`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			string: VALIDATION_MESSAGES.string,
			date: VALIDATION_MESSAGES.date,
			"day.before": VALIDATION_MESSAGES.before("day", "tomorrow"),
		};
	}
}

module.exports = StoreJournal;
