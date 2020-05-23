const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const {HabitVotesGetter} = require("./HabitVotesGetter");
const {VotesStreakCalculator} = require("./VotesStreakCalculator");

// This is a variation of the Strategy pattern (without the class bloat)
// Basing on habit being trackable, we won't to display it in a different way.

// To the basic habit model, we append 'progress_streak' and 'regress_streak'.
const DetailedHabitViewStrategies = {
	trackable_habit: {
		async execute(habit) {
			const habitVotesGetter = new HabitVotesGetter(habit);

			const habitVotes = await habitVotesGetter.get();

			const votesStreakCalculator = new VotesStreakCalculator(habitVotes);

			const progress_streak = votesStreakCalculator.calculate(HABIT_VOTE_TYPES.progress);
			const regress_streak = votesStreakCalculator.calculate(HABIT_VOTE_TYPES.regress);

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

module.exports = {
	DetailedHabitViewStrategies,
};
