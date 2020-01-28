const HabitVote = use("HabitVote");
const Habit = use("Habit");
const Database = use("Database");

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

	async index({request, response, auth}) {
		const habitId = Number(request.get().habitId);

		const habit = await Habit.find(habitId);

		if (!habit) return response.unprocessableEntity();
		if (habit.user_id !== auth.user.id) return response.accessDenied();
		if (!habit.is_trackable) return response.unprocessableEntity();

		const result = await Database.select("id", "vote", "day", "comment", "habit_id")
			.from("habit_votes")
			.where("habit_id", habitId)
			.whereRaw("comment IS NOT NULL")
			.orderBy("day", "desc");

		return response.send(result);
	}
}

module.exports = VoteCommentController;
