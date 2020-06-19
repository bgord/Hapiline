const Model = use("Model");

class Journal extends Model {
	user() {
		return this.belongsTo("App/Models/User");
	}

	static formatDates(_field, value) {
		return new Date(value).toISOString();
	}
}

module.exports = Journal;
