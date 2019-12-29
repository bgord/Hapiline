const Schema = use("Schema");

const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

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
				.notNullable();
			table.enum("vote", votes);
			table.timestamps();
		});
	}

	down() {
		this.drop("habit_votes");
	}
}

module.exports = HabitVotesSchema;
