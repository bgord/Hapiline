const BaseHttpValidator = use("BaseHttpValidator");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class ShowHabitVotesForDay extends BaseHttpValidator {
	get rules() {
		const timeZone = this.ctx.request.header("timezone");

		return {
			day: `required|date|not-in-the-future:${timeZone}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			date: VALIDATION_MESSAGES.date,
			"not-in-the-future": VALIDATION_MESSAGES.not_in_the_future,
		};
	}
}

module.exports = ShowHabitVotesForDay;
