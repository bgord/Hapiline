const datefns = require("date-fns");

const Database = use("Database");

class HabitVotesGetter {
	constructor(habit) {
		this.habit = habit;
	}

	async get() {
		const habitVotes = await Database.select("vote", "day")
			.from("habit_votes")
			.where({
				habit_id: this.habit.id,
			})
			.orderBy("day");

		const days = datefns
			.eachDayOfInterval({
				start: new Date(this.habit.created_at),
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
}

module.exports = {HabitVotesGetter};
