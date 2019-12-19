const Model = use("Model");

class Habit extends Model {
	user() {
		return this.belongsTo("App/Models/User");
	}
}

module.exports = Habit;
