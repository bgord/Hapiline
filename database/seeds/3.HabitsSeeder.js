const User = use("User");
const Habit = use("Habit");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

class HabitsSeeder {
	async run() {
		const users = await User.all();

		for (let [i, user] of users.toJSON().entries()) {
			const howManyHabits = (user.id - 1) * 5;

			const payload = Array.from({length: howManyHabits}).map((_, j) => ({
				user_id: user.id,
				name: `${j} ${"lorem".repeat((j % 3) + 1)}`,
				score: Object.keys(HABIT_SCORE_TYPES)[j % 3],
				order: i + j + 1,
			}));

			await Habit.createMany(payload);
		}
	}
}

module.exports = HabitsSeeder;
