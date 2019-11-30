const User = use("User");
const HabitScoreboardItem = use("HabitScoreboardItem");
const faker = require("faker");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

class HabitScoreboardItemsSeeder {
	async run() {
		const users = await User.all();

		for (let user of users.toJSON()) {
			const howManyHabitScoreboardItems = (user.id - 1) * 5;
			const payload = Array.from({length: howManyHabitScoreboardItems}).map(
				(_, index) => ({
					user_id: user.id,
					name: faker.lorem.words(3),
					score: Object.keys(HABIT_SCORE_TYPES)[index % 3],
				}),
			);
			await HabitScoreboardItem.createMany(payload);
		}
	}
}

module.exports = HabitScoreboardItemsSeeder;
