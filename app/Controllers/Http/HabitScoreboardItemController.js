const Database = use("Database");

class HabitScoreboardItemController {
	async store({request, response}) {
		const payload = request.only(["name", "score", "user_id"]);
		const [result] = await Database.table("habit_scoreboard_items")
			.insert(payload)
			.returning("*");
		return response.status(201).send(result);
	}
}

module.exports = HabitScoreboardItemController;
