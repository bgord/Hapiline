const Database = use("Database");
const Habit = use("Habit");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

class HabitsSeeder {
	async run() {
		const users = await Database.table("users");

		for (let user of users) {
			const howManyHabits = (user.id - 1) * 5;

			const payload = Array.from({length: howManyHabits}).map((_, index) => {
				return {
					user_id: user.id,
					name: `${index} ${"lorem".repeat((index % 3) + 1)}`,
					score: Object.keys(HABIT_SCORE_TYPES)[index % 3],
					order: index,
				};
			});

			await Habit.createMany(payload);
		}
	}
}

module.exports = HabitsSeeder;
