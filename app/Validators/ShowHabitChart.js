const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const HABIT_VOTE_CHART_DATE_RANGE = use("HABIT_VOTE_CHART_DATE_RANGE");

const BaseHttpValidator = use("BaseHttpValidator");

class ShowHabitChart extends BaseHttpValidator {
	get rules() {
		return {
			habitVoteChartDateRange: `required|in:${Object.keys(HABIT_VOTE_CHART_DATE_RANGE).join(",")}`,
		};
	}

	get messages() {
		return {
			required: VALIDATION_MESSAGES.required,
			in: VALIDATION_MESSAGES.invalid_habit_vote_chart_date_range,
		};
	}
}

module.exports = ShowHabitChart;
