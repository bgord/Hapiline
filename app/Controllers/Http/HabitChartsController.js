const Habit = use("Habit");
const datefns = require("date-fns");
const CHART_DATE_RANGES = use("CHART_DATE_RANGES");

const {HabitVotesGetter} = require("../../Beings/HabitVotesGetter");

class HabitChartsController {
	async show({params, request, response, auth}) {
		const {dateRange} = request.only(["dateRange"]);
		const id = Number(params.id);

		const today = new Date();

		const habit = await Habit.find(id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		if (!habit.is_trackable) return response.unprocessableEntity();

		const chartDateRangeToStartDate = {
			[CHART_DATE_RANGES.last_week]: datefns.subDays(today, 6),
			[CHART_DATE_RANGES.last_month]: datefns.subDays(today, 30),
			[CHART_DATE_RANGES.all_time]: new Date(habit.created_at),
		};

		const habitVotesGetter = new HabitVotesGetter(habit);
		const habitVotes = await habitVotesGetter.get({from: chartDateRangeToStartDate[dateRange]});

		return response.send(habitVotes.reverse());
	}
}

module.exports = HabitChartsController;
