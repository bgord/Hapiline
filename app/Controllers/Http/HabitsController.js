const Habit = use("Habit");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const Database = use("Database");

class HabitsController {
	async store({request, response}) {
		const payload = request.only(["name", "score", "user_id"]);
		try {
			const result = await Habit.create(payload);
			return response.status(201).send(result);
		} catch (e) {
			if (
				e.message.includes("duplicate key value violates unique constraint")
			) {
				return response.validationError({
					argErrors: [
						{
							message: VALIDATION_MESSAGES.unique_habit,
							field: "name",
							validation: "unique",
						},
					],
				});
			}
		}
	}

	async index({response, auth}) {
		const result = await Database.table("habits")
			.where("user_id", auth.user.id)
			.orderBy("id");
		return response.send(result);
	}

	async delete({params, response, auth}) {
		const {id} = params;
		const loggedInUserId = auth.user.id;

		try {
			const deletedItemsCounter = await Database.table("habits")
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

	async update({request, response, params, auth}) {
		const {id} = params;
		const payload = request.only(["name", "score"]);

		const habit = await Habit.find(id);
		if (habit.user_id !== auth.user.id) {
			return response.accessDenied();
		}

		try {
			await habit.merge(payload);
			await habit.save();
			return response.send(habit);
		} catch (e) {
			if (
				e.message.includes("duplicate key value violates unique constraint")
			) {
				return response.validationError({
					argErrors: [
						{
							message: VALIDATION_MESSAGES.unique_habit,
							field: "name",
							validation: "unique",
						},
					],
				});
			}
		}
	}
}

module.exports = HabitsController;
