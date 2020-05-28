const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

class VotesStreakCalculator {
	constructor(votes) {
		this.votes = votes.map(entry => entry.vote);
	}

	calculate(type) {
		// By default, there's no streak
		let streak = 0;

		// The votes array looks like that (sorted by day)
		// [
		//  { day: 2020-05-28T00:00:00.000Z, vote: null},
		//  { day: 2020-05-27T00:00:00.000Z, vote: 'progress'},
		// ...
		// ]

		// The algorithm is simple:
		// - given streak counts if there are only votes of given type in a row,
		//   without any interruptions
		//
		// - `null` and `plateau` votes reset the streaks
		//
		for (const vote of this.votes) {
			if (vote === HABIT_VOTE_TYPES[type]) {
				streak++;
			} else {
				streak = 0;
			}
		}

		return streak;
	}
}

module.exports = {VotesStreakCalculator};
