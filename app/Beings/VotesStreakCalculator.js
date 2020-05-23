const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

class VotesStreakCalculator {
	constructor(votes) {
		this.votes = votes.map(entry => entry.vote);
	}

	calculate(type) {
		let streak = 0;

		for (const [index, vote] of this.votes.entries()) {
			if (index === 0 && vote !== HABIT_VOTE_TYPES[type]) {
				break;
			} else if (vote === HABIT_VOTE_TYPES[type]) {
				streak++;
			} else break;
		}

		return streak;
	}
}

module.exports = {VotesStreakCalculator};
