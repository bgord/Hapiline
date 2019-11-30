const Schema = use("Schema");
const HABIT_SCORE_TYPES = use("HABIT_SCORE_TYPES");

const scores = Object.keys(HABIT_SCORE_TYPES);

class HabitScoreboardItemsSchema extends Schema {
	up() {
		this.create("habit_scoreboard_items", table => {
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
		this.drop("habit_scoreboard_items");
	}
}

module.exports = HabitScoreboardItemsSchema;
