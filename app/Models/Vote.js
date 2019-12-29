const Model = use("Model");

class Vote extends Model {
	habit() {
		return this.belongsTo("App/Models/Habit");
	}
}

module.exports = Vote;
