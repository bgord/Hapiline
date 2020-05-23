const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const {HabitVotesGetter} = require("../../Beings/HabitVotesGetter");

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
			const habitVotes = await habitVotesGetter.get();

			const progress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.progress, habitVotes);
			if (progress_streak > 0) {
				result.progress_streaks.push({...habit, progress_streak});
			}

			const regress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.regress, habitVotes);
			if (regress_streak > 0) {
				result.regress_streaks.push({...habit, regress_streak});
			}
		}

		return response.send({
			progress_streaks: Array.from(result.progress_streaks).sort((a, b) =>
				a.progress_streak > b.progress_streak ? -1 : 1,
			),
			regress_streaks: Array.from(result.regress_streaks).sort((a, b) =>
				a.regress_streak > b.regress_streak ? -1 : 1,
			),
		});
	}
}

module.exports = DashboardStreakStatsController;

function getVoteTypeStreak(type, votes) {
	let streak = 0;

	for (const [index, vote] of votes.entries()) {
		if (index === 0 && vote !== HABIT_VOTE_TYPES[type]) {
			break;
		} else if (vote === HABIT_VOTE_TYPES[type]) {
			streak++;
		} else break;
	}

	return streak;
}
