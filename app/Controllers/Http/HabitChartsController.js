const datefns = require("date-fns");
const {formatToTimeZone} = require("date-fns-timezone");
const Habit = use("Habit");
const HABIT_VOTE_CHART_DATE_RANGE = use("HABIT_VOTE_CHART_DATE_RANGE");

const {HabitVotesGetter} = require("../../Beings/HabitVotesGetter");

class HabitChartsController {
	async show({params, request, response, auth}) {
		const {habitVoteChartDateRange} = request.only(["habitVoteChartDateRange"]);
		const timeZone = request.header("timezone");
		const id = Number(params.id);

		const currentDateInTimeZone = formatToTimeZone(new Date(), "YYYY-MM-DD", {timeZone});

		const habit = await Habit.find(id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		if (!habit.is_trackable) return response.unprocessableEntity();

		const habitVoteChartDateRangeToStartDate = {
			[HABIT_VOTE_CHART_DATE_RANGE.last_week]: datefns.subDays(new Date(currentDateInTimeZone), 6),
			[HABIT_VOTE_CHART_DATE_RANGE.last_month]: datefns.subDays(
				new Date(currentDateInTimeZone),
				30,
			),
			[HABIT_VOTE_CHART_DATE_RANGE.all_time]: new Date(habit.created_at),
		};

		const habitVotesGetter = new HabitVotesGetter(habit);

		const habitVotes = await habitVotesGetter.get({
			from: habitVoteChartDateRangeToStartDate[habitVoteChartDateRange],
		});

		return response.send(habitVotes.reverse());
	}
}

module.exports = HabitChartsController;
