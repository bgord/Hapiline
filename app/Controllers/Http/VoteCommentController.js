const HabitVote = use("HabitVote");
const Habit = use("Habit");

class VoteCommentController {
	async update({params, request, response, auth}) {
		const {comment} = request.only(["comment"]);
		const voteId = Number(params.id);

		const vote = await HabitVote.find(voteId);
		const habit = await Habit.find(vote.habit_id);

		if (auth.user.id !== habit.user_id) return response.accessDenied();

		await vote.merge({comment: comment || null});
		await vote.save();

		response.send(vote);
	}

	async index({response}) {
		return response.send();
	}
}

module.exports = VoteCommentController;
