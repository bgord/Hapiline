const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const datefns = require("date-fns");

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
			const habitVotes = await getVotesForHabit(habit);

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
			progress_streaks: result.progress_streaks.sort(
				(a, b) => a.progress_streak > b.progress_streak,
			),
			regress_streaks: result.regress_streaks.sort((a, b) => a.regress_streak > b.regress_streak),
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

async function getVotesForHabit(habit) {
	const habitVotes = await Database.select("vote", "day")
		.from("habit_votes")
		.where({
			habit_id: habit.id,
		})
		.orderBy("day");

	const days = datefns
		.eachDayOfInterval({
			start: new Date(habit.created_at),
			end: new Date(),
		})
		.map(day => {
			const dayVote = habitVotes.find(vote => datefns.isSameDay(vote.day, day));
			return {
				day,
				vote: dayVote ? dayVote.vote : null,
			};
		});

	return [...days].reverse().map(day => day.vote);
}
