const datefns = require("date-fns");
const Database = use("Database");
const today = Date.now();

class JournalSeeder {
	async run() {
		const users = await Database.table("users");

		for (let user of users) {
			const ts = datefns
				.subDays(today, Math.ceil(Math.random()) % 3)
				.setHours(Math.ceil(Math.random()) & 3);
			const date = new Date(ts).toISOString();
			const payload = {
				user_id: user.id,
				content: `${Math.ceil(Math.random())} ${"lorem ipsum".repeat(
					(Math.ceil(Math.random()) % 3) + 1,
				)}`,
				day: new Date().toISOString(),
				created_at: date,
				updated_at: date,
			};
			await Database.into("journals").insert(payload);
		}
	}
}

module.exports = JournalSeeder;
