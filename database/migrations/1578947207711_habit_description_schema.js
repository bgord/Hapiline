const Schema = use("Schema");

class HabitDescriptionSchema extends Schema {
	up() {
		this.table("habits", table => {
			table.string("description", 1024);
		});
	}

	down() {
		this.table("habits", table => {
			table.dropColumn("description");
		});
	}
}

module.exports = HabitDescriptionSchema;
