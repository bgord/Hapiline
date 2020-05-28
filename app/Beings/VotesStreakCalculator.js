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
		for (const [index, vote] of this.votes.entries()) {
			//
			if (index === 0 && vote !== HABIT_VOTE_TYPES[type]) {
				break;
			} else if (vote === HABIT_VOTE_TYPES[type]) {
				streak++;
			} else {
				break;
			}
		}

		return streak;
	}
}

module.exports = {VotesStreakCalculator};
