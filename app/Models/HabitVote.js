const Model = use("Model");

class HabitVote extends Model {
	habit() {
		return this.belongsTo("App/Models/Habit");
	}
}

module.exports = HabitVote;
