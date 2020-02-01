const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

const BaseHttpValidator = use("BaseHttpValidator");
const NOTIFICATION_STATUSES = use("NOTIFICATION_STATUSES");

class UpdateNotification extends BaseHttpValidator {
	get rules() {
		return {
			status: `required|in:${Object.keys(NOTIFICATION_STATUSES)}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			in: VALIDATION_MESSAGES.invalid_notification_status,
		};
	}
}

module.exports = UpdateNotification;
