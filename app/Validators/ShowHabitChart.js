const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const CHART_DATE_RANGES = use("CHART_DATE_RANGES");

const BaseHttpValidator = use("BaseHttpValidator");

class ShowHabitChart extends BaseHttpValidator {
	get rules() {
		return {
			dateRange: `required|in:${Object.keys(CHART_DATE_RANGES).join(",")}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			in: VALIDATION_MESSAGES.invalid_chart_date_range,
		};
	}
}

module.exports = ShowHabitChart;
