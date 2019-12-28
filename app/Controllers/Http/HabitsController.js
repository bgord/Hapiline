const Habit = use("Habit");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const Database = use("Database");

class HabitsController {
	async store({request, response, auth}) {
		const payload = request.only(["name", "score", "strength", "user_id"]);
		try {
			const {maxOrderValue} = await Database.table("habits")
				.max("order as maxOrderValue")
				.where("user_id", auth.user.id)
				.first();

			const result = await Habit.create({
				...payload,
				order: Number(maxOrderValue) + 1,
			});
			return response.status(201).send(result);
		} catch (error) {
			if (
				error.message.includes("duplicate key value violates unique constraint")
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
			throw error;
		}
	}

	async index({response, auth}) {
		const result = await auth.user
			.habits()
			.orderBy("order")
			.fetch();
		return response.send(result);
	}

	async show({params, response, auth}) {
		const result = await Database.table("habits")
			.where("id", params.id)
			.first();

		if (!result) return response.notFound();
		if (result.user_id !== auth.user.id) return response.accessDenied();
		return response.send(result);
	}

	async delete({params, response, auth}) {
		try {
			const deletedItemsCounter = await auth.user
				.habits()
				.where({id: params.id})
				.delete();

			if (!deletedItemsCounter) throw error;
			return response.send();
		} catch (error) {
			return response.accessDenied();
		}
	}

	async update({request, response, params, auth}) {
		const payload = request.only(["name", "score", "strength"]);

		const habit = await Habit.find(params.id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		try {
			await habit.merge(payload);
			await habit.save();

			return response.send(habit);
		} catch (error) {
			if (
				error.message.includes("duplicate key value violates unique constraint")
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
			throw error;
		}
	}
}

module.exports = HabitsController;
