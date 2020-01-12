const Database = use("Database");

class VoteCommentController {
	async update({params, response, auth}) {
		const voteId = Number(params.id);

		const vote = await Database.table("habit_votes")
			.where("id", voteId)
			.first();
		const habit = await Database.table("habits")
			.where("id", vote.habit_id)
			.first();

		if (auth.user.id !== habit.user_id) {
			return response.accessDenied();
		}

		response.send();
	}
}

module.exports = VoteCommentController;
