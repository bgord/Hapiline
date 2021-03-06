const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const {HabitVotesGetter} = require("../../Beings/HabitVotesGetter");
const {VotesStreakCalculator} = require("../../Beings/VotesStreakCalculator");
const {orderByDescendingStreak} = require("../../Beings/orderByDescendingStreak");

class DashboardStreakStatsController {
	async index({request, auth}) {
		const timeZone = request.header("timezone");

		const habits = await Database.select("id", "name", "created_at")
			.from("habits")
			.where("user_id", auth.user.id);

		const result = {
			progress_streaks: [],
			regress_streaks: [],
			no_streak: [],
		};

		for (const habit of habits) {
			const habitVotesGetter = new HabitVotesGetter(habit, timeZone);
			const habitVotes = await habitVotesGetter.get({from: new Date(habit.created_at)});

			const votesStreakCalculator = new VotesStreakCalculator(habitVotes);

			const progress_streak = votesStreakCalculator.calculate(HABIT_VOTE_TYPES.progress);
			if (progress_streak > 0) {
				result.progress_streaks.push({
					...habit,
					progress_streak,
					has_vote_for_today: Boolean(habitVotes[0].vote),
				});
				continue;
			}

			const regress_streak = votesStreakCalculator.calculate(HABIT_VOTE_TYPES.regress);
			if (regress_streak > 0) {
				result.regress_streaks.push({
					...habit,
					regress_streak,
					has_vote_for_today: Boolean(habitVotes[0].vote),
				});
				continue;
			}

			result.no_streak.push({
				...habit,
				has_vote_for_today: Boolean(habitVotes[0].vote),
			});
		}

		return {
			progress_streaks: Array.from(result.progress_streaks).sort(
				orderByDescendingStreak("progress_streak"),
			),
			regress_streaks: Array.from(result.regress_streaks).sort(
				orderByDescendingStreak("regress_streak"),
			),
			no_streak: result.no_streak,
		};
	}
}

module.exports = DashboardStreakStatsController;
