const Model = use("Model");

class HabitVote extends Model {
	habit() {
		return this.belongsTo("App/Models/Habit");
	}

	static formatDates(_field, value) {
		return new Date(value).toISOString();
	}
}

module.exports = HabitVote;
