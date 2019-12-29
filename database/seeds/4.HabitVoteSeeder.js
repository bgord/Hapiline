const datefns = require("date-fns");

const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const HabitVote = use("HabitVote");

class HabitVoteSeeder {
	async run() {
		const today = new Date();
		const habits = await Database.table("habits");

		let lastVoteIndex = 0;

		for (const [index, habit] of habits.entries()) {
			if (index % 2 === 1) {
				const creationDate = new Date(habit.created_at);

				const days = datefns.eachDayOfInterval({start: creationDate, end: today});

				const payload = days.map(day => {
					const voteIndex = lastVoteIndex;
					lastVoteIndex = lastVoteIndex === 3 ? 0 : lastVoteIndex + 1;

					return {
						day,
						habit_id: habit.id,
						vote: [...Object.keys(HABIT_VOTE_TYPES), null][voteIndex],
					};
				});

				await HabitVote.createMany(payload);
			}
		}
	}
}

module.exports = HabitVoteSeeder;
