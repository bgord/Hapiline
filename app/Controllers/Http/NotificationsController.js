const Database = use("Database");
const Notification = use("Notification");

class NotificationsController {
	async index({auth, response}) {
		const userNotifications = await Database.select("*")
			.from("notifications")
			.where({user_id: auth.user.id})
			.orderBy("created_at", "desc")
			.orderBy("id", "asc");

		return response.send(userNotifications);
	}

	async update({auth, request, response, params}) {
		const notificationToBeUpdatedId = Number(params.id);
		const newNotificationPayload = request.only(["status"]);

		const notification = await Notification.find(notificationToBeUpdatedId);

		if (notification.user_id !== auth.user.id) return response.accessDenied();

		notification.merge({
			status: newNotificationPayload.status,
		});

		await notification.save();

		return response.send(notification);
	}
}

module.exports = NotificationsController;
