const Model = use("Model");

class Notification extends Model {
	user() {
		return this.belongsTo("App/Models/User");
	}

	static formatDates(_field, value) {
		return new Date(value).toISOString();
	}
}

module.exports = Notification;
