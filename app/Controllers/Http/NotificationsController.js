const Database = use("Database");

class NotificationsController {
	async index({auth, response}) {
		return response.send();
	}
}

module.exports = NotificationsController;
