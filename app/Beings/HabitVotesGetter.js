const datefns = require("date-fns");
const {formatToTimeZone} = require("date-fns-timezone");

const Database = use("Database");

class HabitVotesGetter {
	constructor(habit, timeZone) {
		this.habit = habit;
		this.timeZone = timeZone;
	}

	async get({from}) {
		const currentDateInTimeZone = formatToTimeZone(new Date(), "YYYY-MM-DD", {
			timeZone: this.timeZone,
		});

		const days = datefns.eachDayOfInterval({
			start: datefns.startOfDay(from),
			end: new Date(currentDateInTimeZone),
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
					day,
					vote: dayVote ? dayVote.vote : null,
				};
			})
			.reverse();
	}
}

module.exports = {HabitVotesGetter};
