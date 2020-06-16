const Schema = use("Schema");

class JournalSchema extends Schema {
	up() {
		this.create("journals", table => {
			table.increments();
			table
				.integer("user_id")
				.references("id")
				.inTable("users")
				.unsigned()
				.notNullable();
			table.string("content").notNullable(); //to confirm about nullable
			table.date("day").notNullable();
			table.unique(["user_id", "day"]);
			table.timestamps(true, true);
		});
	}

	down() {
		this.drop("journals");
	}
}

module.exports = JournalSchema;
