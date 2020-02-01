const Schema = use("Schema");
const NOTIFICATION_TYPES = use("NOTIFICATION_TYPES");
const NOTIFICATION_STATUSES = use("NOTIFICATION_STATUSES");

class NotificationsSchema extends Schema {
	up() {
		this.create("notifications", table => {
			table.increments();

			table.string("content").notNullable();
			table.enum("type", Object.keys(NOTIFICATION_TYPES)).notNullable();
			table.enum("status", Object.keys(NOTIFICATION_STATUSES)).notNullable();
			table
				.integer("user_id")
				.references("id")
				.inTable("users")
				.unsigned()
				.notNullable();

			table.timestamps();
		});
	}

	down() {
		this.drop("notifications");
	}
}

module.exports = NotificationsSchema;
