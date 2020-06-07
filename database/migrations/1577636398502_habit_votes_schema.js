const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const Schema = use("Schema");

const votes = Object.keys(HABIT_VOTE_TYPES);

class HabitVotesSchema extends Schema {
	up() {
		this.create("habit_votes", table => {
			table.increments();
			table
				.integer("habit_id")
				.references("id")
				.inTable("habits")
				.unsigned()
				.notNullable()
				.onDelete("cascade");
			table.enum("vote", votes);
			table.date("day").notNullable();
			table.timestamps(true, true);

			table.unique(["habit_id", "day"]);
		});
	}

	down() {
		this.drop("habit_votes");
	}
}

module.exports = HabitVotesSchema;
