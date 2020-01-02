const Habit = use("Habit");
const datefns = require("date-fns");
const CHART_DATE_RANGES = use("CHART_DATE_RANGES");
const Database = use("Database");

class HabitsController {
	async show({params, request, response, auth}) {
		const {dateRange} = request.only(["dateRange"]);
		const id = Number(params.id);

		const today = new Date();

		const habit = await Habit.find(id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		const chartDateRangeToStartDate = {
			[CHART_DATE_RANGES.last_week]: datefns.subDays(today, 6),
			[CHART_DATE_RANGES.last_month]: datefns.subDays(today, 30),
			[CHART_DATE_RANGES.all_time]: habit.created_at,
		};

		const days = datefns.eachDayOfInterval({
			start: chartDateRangeToStartDate[dateRange],
			end: today,
		});

		const votes = await Database.select("day", "vote")
			.from("habit_votes")
			.where("habit_id", habit.id)
			.whereIn("day", days);

		const result = days.map(day => {
			const voteFromDay = votes.find(vote => datefns.isSameDay(vote.day, day));
			return {
				day,
				vote: voteFromDay ? voteFromDay.vote : null,
			};
		});

		return response.send(result);
	}
}

module.exports = HabitsController;
