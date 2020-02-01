/* eslint-disable */
const Database = use("Database");
const NOTIFICATION_TYPES = use("NOTIFICATION_TYPES");
const NOTIFICATION_STATUSES = use("NOTIFICATION_STATUSES");
const Notification = use("Notification");

class HabitVoteSeeder {
	async run() {
		const users = await Database.table("users");

		const payload = [];

		for (const [i, user] of users.entries()) {
			const notifications = Array.from({length: i}).map((_, j) => ({
				content: "Congratulations! You did something good.",
				type: NOTIFICATION_TYPES.regular,
				status: NOTIFICATION_STATUSES[j % 2 === 0 ? "unread" : "read"],
				user_id: user.id,
			}));
			payload.push(...notifications);
		}

		await Notification.createMany(payload);
	}
}

module.exports = HabitVoteSeeder;
