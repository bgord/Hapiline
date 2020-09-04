const Database = use("Database");

class HabitVotesForDayController {
	async show({request, auth}) {
		return Database.select("habit_votes.*")
			.from("habit_votes")
			.innerJoin("habits", "habits.id", "habit_votes.habit_id")
			.where({
				"habits.user_id": auth.user.id,
				day: request.only(["day"]).day,
			})
			.orderBy("habit_votes.habit_id");
	}
}

module.exports = HabitVotesForDayController;
