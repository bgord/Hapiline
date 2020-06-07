const Schema = use("Schema");

class UserSchema extends Schema {
	up() {
		this.create("users", table => {
			table.increments();
			table
				.string("email", 254)
				.notNullable()
				.unique();
			table.string("account_status").notNullable();
			table.string("password", 60).notNullable();
			table.timestamps(true, true);
		});
	}

	down() {
		this.drop("users");
	}
}

module.exports = UserSchema;
