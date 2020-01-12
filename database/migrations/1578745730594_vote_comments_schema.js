const Schema = use("Schema");

class VoteCommentsSchema extends Schema {
	up() {
		this.table("habit_votes", table => {
			table.string("comment", 1024);
		});
	}

	down() {
		this.table("habit_votes", table => {
			table.dropColumn("comment");
		});
	}
}

module.exports = VoteCommentsSchema;
