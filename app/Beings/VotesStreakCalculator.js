const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

class VotesStreakCalculator {
	constructor(votes) {
		// It accepts the votes that are in reverse chronological order
		// but under the hood a conversion is made to make calculations easier.
		this.votes = [...votes].map(entry => entry.vote).reverse();
	}

	calculate(type) {
		// By default, there's no streak
		let streak = 0;

		// The votes array looks like that (sorted by day)
		// [
		//  { day: 2020-05-27T00:00:00.000Z, vote: 'progress'},
		//  { day: 2020-05-28T00:00:00.000Z, vote: null},
		// ...
		// ]

		// The algorithm is simple:
		// - given streak counts if there are only votes of given type in a row,
		//   without any interruptions
		//
		// - `null` and `plateau` votes reset the streaks with a few exceptions:
		//    - if today's vote is `null`
		//
		for (const [index, vote] of this.votes.entries()) {
			// If todays' vote is `null`, it doesn't reset the streak
			const isNullVoteForToday = index === this.votes.length - 1 && vote === null;

			if (vote === HABIT_VOTE_TYPES[type]) {
				streak++;
			} else if (isNullVoteForToday) {
				continue;
			} else {
				streak = 0;
			}
		}

		return streak;
	}
}

module.exports = {VotesStreakCalculator};
