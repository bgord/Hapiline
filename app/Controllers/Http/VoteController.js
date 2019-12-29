const Vote = use("Vote");
const Habit = use("Habit");

class VoteController {
	async update({request, response, auth}) {
		const payload = request.only(["habit_id", "vote"]);

		const habit_id = payload.habit_id;
		const vote = payload.vote || null;

		const habit = await Habit.find(habit_id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		return response.send();
	}
}

module.exports = VoteController;
