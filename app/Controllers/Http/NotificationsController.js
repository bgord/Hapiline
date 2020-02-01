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
	async update({auth, response, params}) {
		const notificationId = Number(params.id);

		const notification = await Database.table("notifications").where("id", notificationId);

		if (notification.user_id !== auth.user.id) return response.accessDenied();

		return response.send();
	}
}

module.exports = NotificationsController;
