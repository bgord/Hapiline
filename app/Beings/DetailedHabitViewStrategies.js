const datefns = require("date-fns");

const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const Database = use("Database");

// This is a variation of the Strategy pattern (without the class bloat)
// Basing on habit being trackable, we won't to display it in a different way.
const DetailedHabitViewStrategies = {
	trackable_habit: {
		async execute(habit) {
			const votes = await getVotesForHabit(habit);

			const progress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.progress, votes);
			const regress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.regress, votes);

			return {
				...habit,
				progress_streak,
				regress_streak,
			};
		},
	},
	untrackable_habit: {
		async execute(habit) {
			return {
				...habit,
				progress_streak: 0,
				regress_streak: 0,
			};
		},
	},
};

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

module.exports = {
	DetailedHabitViewStrategies,
};
