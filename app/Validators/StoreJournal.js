const BaseHttpValidator = use("BaseHttpValidator");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class StoreJournal extends BaseHttpValidator {
	get rules() {
		const timeZone = this.ctx.request.header("timezone");

		return {
			day: `required|date|not-in-the-future:${timeZone}`,
			content: `string`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			string: VALIDATION_MESSAGES.string,
			date: VALIDATION_MESSAGES.date,
			"not-in-the-future": VALIDATION_MESSAGES.not_in_the_future,
		};
	}
}

module.exports = StoreJournal;
