const Habit = use("Habit");
const datefns = require("date-fns");
const HABIT_VOTE_CHART_DATE_RANGE = use("HABIT_VOTE_CHART_DATE_RANGE");

const {HabitVotesGetter} = require("../../Beings/HabitVotesGetter");

class HabitChartsController {
	async show({params, request, response, auth}) {
		const {habitVoteChartDateRange} = request.only(["habitVoteChartDateRange"]);
		const id = Number(params.id);

		const today = new Date();

		const habit = await Habit.find(id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		if (!habit.is_trackable) return response.unprocessableEntity();

		const habitVoteChartDateRangeToStartDate = {
			[HABIT_VOTE_CHART_DATE_RANGE.last_week]: datefns.subDays(today, 6),
			[HABIT_VOTE_CHART_DATE_RANGE.last_month]: datefns.subDays(today, 30),
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
