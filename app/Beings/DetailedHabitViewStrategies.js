const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const {HabitVotesGetter} = require("./HabitVotesGetter");

// This is a variation of the Strategy pattern (without the class bloat)
// Basing on habit being trackable, we won't to display it in a different way.
const DetailedHabitViewStrategies = {
	trackable_habit: {
		async execute(habit) {
			const habitVotesGetter = new HabitVotesGetter(habit);

			const habitVotes = await habitVotesGetter.get();

			const progress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.progress, habitVotes);
			const regress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.regress, habitVotes);

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
