const Database = use("Database");
const Notification = use("Notification");

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
	async update({auth, request, response, params}) {
		const notificationId = Number(params.id);
		const payload = request.only(["status"]);

		const notification = await Notification.find(notificationId);

		if (notification.user_id !== auth.user.id) return response.accessDenied();

		notification.merge({
			status: payload.status,
		});

		await notification.save();

		return response.send(notification);
	}
}

module.exports = NotificationsController;
