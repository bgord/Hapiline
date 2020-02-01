const Database = use("Database");

class NotificationsController {
	async index({auth, response}) {
		const results = await Database.select("*")
			.from("notifications")
			.where({
				user_id: auth.user.id,
			})
			.orderBy("created_at", "DESC");
		return response.send(results);
	}
}

module.exports = NotificationsController;
