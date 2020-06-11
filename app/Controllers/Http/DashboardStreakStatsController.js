const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const {HabitVotesGetter} = require("../../Beings/HabitVotesGetter");
const {VotesStreakCalculator} = require("../../Beings/VotesStreakCalculator");

class DashboardStreakStatsController {
	async index({auth, response}) {
		const habits = await Database.select("id", "name", "created_at")
			.from("habits")
			.where("user_id", auth.user.id);

		const result = {
			progress_streaks: [],
			regress_streaks: [],
		};

		for (const habit of habits) {
			const habitVotesGetter = new HabitVotesGetter(habit);
			const habitVotes = await habitVotesGetter.get({from: new Date(habit.created_at)});

			const votesStreakCalculator = new VotesStreakCalculator(habitVotes);

			const progress_streak = votesStreakCalculator.calculate(HABIT_VOTE_TYPES.progress);
			if (progress_streak > 0) {
				result.progress_streaks.push({
					...habit,
					progress_streak,
					has_vote_for_today: Boolean(habitVotes[0].vote),
				});
			}

			const regress_streak = votesStreakCalculator.calculate(HABIT_VOTE_TYPES.regress);
			if (regress_streak > 0) {
				result.regress_streaks.push({
					...habit,
					regress_streak,
					has_vote_for_today: Boolean(habitVotes[0].vote),
				});
			}
		}

		return response.send({
			progress_streaks: Array.from(result.progress_streaks).sort(
				orderByDescendingStreak("progress_streak"),
			),
			regress_streaks: Array.from(result.regress_streaks).sort(
				orderByDescendingStreak("regress_streak"),
			),
		});
	}
}

module.exports = DashboardStreakStatsController;

function orderByDescendingStreak(key) {
	return (a, b) => (a[key] > b[key] ? -1 : 1);
}
