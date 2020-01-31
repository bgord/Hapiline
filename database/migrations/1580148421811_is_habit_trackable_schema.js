const Schema = use("Schema");

class IsHabitTrackableSchema extends Schema {
	up() {
		this.table("habits", table => {
			table.boolean("is_trackable").defaultTo(true);
		});
	}

	down() {
		this.table("habits", table => {
			table.dropColumn("is_trackable");
		});
	}
}

module.exports = IsHabitTrackableSchema;
