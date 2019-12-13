const Schema = use("Schema");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

const scores = Object.keys(HABIT_SCORE_TYPES);

class HabitsSchema extends Schema {
	up() {
		this.create("habits", table => {
			table.increments();
			table.string("name", 255).notNullable();
			table.enum("score", scores).notNullable();
			table
				.integer("user_id")
				.references("id")
				.inTable("users")
				.unsigned()
				.notNullable();
			table.timestamps();

			table.unique(["name", "user_id"]);
		});
	}

	down() {
		this.drop("habits");
	}
}

module.exports = HabitsSchema;
