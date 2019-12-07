const HabitScoreboardItem = use("HabitScoreboardItem");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const Database = use("Database");

class HabitScoreboardItemController {
	async store({request, response}) {
		const payload = request.only(["name", "score", "user_id"]);
		try {
			const result = await HabitScoreboardItem.create(payload);
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

	async index({response, auth}) {
		const result = await Database.table("habit_scoreboard_items").where(
			"user_id",
			auth.user.id,
		);
		return response.send(result);
	}

	async delete({params, response, auth}) {
		const {id} = params;
		const loggedInUserId = auth.user.id;

		try {
			const deletedItemsCounter = await Database.table("habit_scoreboard_items")
				.where({
					id,
					user_id: loggedInUserId,
				})
				.delete();

			if (!deletedItemsCounter) throw error;

			return response.send();
		} catch (error) {
			return response.accessDenied();
		}
	}
}

module.exports = HabitScoreboardItemController;
