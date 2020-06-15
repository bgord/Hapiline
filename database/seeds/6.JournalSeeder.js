const Database = use("Database");
const GEN_INT = 10;
class JournalSeeder {
	async run() {
		const users = await Database.table("users");

		for (let user of users) {
			const payload = {
				user_id: user.id,
				content: `${GEN_INT} ${"lorem ipsum".repeat((GEN_INT % 3) + 1)}`,
				day: new Date().toISOString(),
			};
			await Database.into("journals").insert(payload);
		}
	}
}

module.exports = JournalSeeder;
