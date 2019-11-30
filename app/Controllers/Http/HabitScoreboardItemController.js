const Database = use("Database");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class HabitScoreboardItemController {
	async store({request, response}) {
		const payload = request.only(["name", "score", "user_id"]);
		try {
			const [result] = await Database.table("habit_scoreboard_items")
				.insert(payload)
				.returning("*");
			return response.status(201).send(result);
		} catch (e) {
			if (
				e.message.includes("duplicate key value violates unique constraint")
			) {
				return response.validationError({
					argErrors: [
						{
							message: VALIDATION_MESSAGES.unique_habitscoreboard_item,
							field: "name",
							validation: "unique",
						},
					],
				});
			}
			throw e;
		}
	}
}

module.exports = HabitScoreboardItemController;
