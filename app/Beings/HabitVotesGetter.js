const datefns = require("date-fns");

const Database = use("Database");

class HabitVotesGetter {
	constructor(habit) {
		this.habit = habit;
	}

	async get({from}) {
		const days = datefns.eachDayOfInterval({
			start: from,
			end: new Date(),
		});

		const habitVotes = await Database.select("vote", "day")
			.from("habit_votes")
			.where({
				habit_id: this.habit.id,
			})
			.whereIn("day", days)
			.orderBy("day");

		return days
			.map(day => {
				const dayVote = habitVotes.find(vote => datefns.isSameDay(vote.day, day));
				return {
					day: vote.day,
					vote: dayVote ? dayVote.vote : null,
				};
			})
			.reverse();
	}
}

module.exports = {HabitVotesGetter};
