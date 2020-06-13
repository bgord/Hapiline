const datefns = require("date-fns");

const Database = use("Database");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");
const HABIT_STRENGTH_TYPES = use("HABIT_STRENGTH_TYPES");

const today = Date.now();

class HabitsSeeder {
	async run() {
		const users = await Database.table("users");

		for (let user of users) {
			const numberOfHabits = (user.id - 1) * 5;

			const payload = Array.from({length: numberOfHabits}).map((_, index) => {
				const ts = datefns.subDays(today, index % 3).setHours(index & 3);
				const date = new Date(ts).toISOString();

				return {
					user_id: user.id,
					name: `${index} ${"lorem".repeat((index % 3) + 1)}`,
					score: Object.keys(HABIT_SCORE_TYPES)[index % 3],
					strength: Object.keys(HABIT_STRENGTH_TYPES)[index % 3],
					order: index,
					description: index % 3 === 0 ? null : "lorem ".repeat(index),
					is_trackable: true,
					created_at: date,
					updated_at: date,
				};
			});

			// Using Database.insert here because we want to override the
			// default {created,updated}_at dates (which are set to "now").
			await Database.into("habits").insert(payload);
		}
	}
}

module.exports = HabitsSeeder;
