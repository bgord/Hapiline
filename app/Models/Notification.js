const Model = use("Model");

class Notification extends Model {
	user() {
		return this.belongsTo("App/Models/User");
	}
}

module.exports = Notification;
