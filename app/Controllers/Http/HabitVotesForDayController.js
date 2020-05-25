const Database = use("Database");

class HabitVotesForDayController {
	async show({request, response, auth}) {
		const {day} = request.only(["day"]);

		const result = await Database.select("habit_votes.*")
			.from("habit_votes")
			.innerJoin("habits", "habits.id", "habit_votes.habit_id")
			.where({
				"habits.user_id": auth.user.id,
				day,
			})
			.orderBy("habit_votes.habit_id");

		return response.send(result);
	}
}

module.exports = HabitVotesForDayController;
