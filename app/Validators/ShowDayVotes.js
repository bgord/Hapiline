const datefns = require("date-fns");

const BaseHttpValidator = use("BaseHttpValidator");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class ShowDayVotes extends BaseHttpValidator {
	get rules() {
		const tomorrow = datefns.addDays(new Date(), 1);
		return {
			day: `required|date|before:${tomorrow}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			date: VALIDATION_MESSAGES.date,
			"day.before": VALIDATION_MESSAGES.before("day", "tomorrow"),
		};
	}
}

module.exports = ShowDayVotes;
