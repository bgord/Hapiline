const HabitVote = use("HabitVote");
const Habit = use("Habit");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const datefns = require("date-fns");

class VoteController {
	async update({request, response, auth}) {
		const payload = request.only(["habit_id", "vote", "day"]);

		const {habit_id, day} = payload;
		const vote = payload.vote || null;

		const habit = await Habit.find(habit_id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		const habitCreationDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		if (datefns.isEqual(habitCreationDate, dayDate) || datefns.isAfter(habitCreationDate, dayDate))
			return response.validationError({
				argErrors: [
					{
						message: VALIDATION_MESSAGES.before("day", "habit creation"),
						field: "day",
						validation: "before",
					},
				],
			});

		return response.send();
	}
}

module.exports = VoteController;
