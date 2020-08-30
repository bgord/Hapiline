const Habit = use("Habit");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const Database = use("Database");
const {
	NextGreatestUserHabitOrderCalculator,
} = require("../../Beings/NextGreatestUserHabitOrderCalculator");
const {DetailedHabitViewStrategies} = require("../../Beings/DetailedHabitViewStrategies");

class HabitsController {
	async store({request, response, auth}) {
		const newHabitPayload = request.only([
			"name",
			"score",
			"strength",
			"user_id",
			"description",
			"is_trackable",
		]);

		try {
			const nextOrderCalculator = new NextGreatestUserHabitOrderCalculator({
				userId: auth.user.id,
			});

			const order = await nextOrderCalculator.calculate();

			const result = await Habit.create({
				...newHabitPayload,
				order,
			});

			return response.status(201).send(result);
		} catch (error) {
			if (error.message.includes("duplicate key value violates unique constraint")) {
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

	async show({request, params, response, auth}) {
		const timeZone = request.header("timezone");

		// Just try to get the habit, doesn't really matter
		// if it belongs to `auth.user` or if it exists.
		const habit = await Database.table("habits")
			.where("id", params.id)
			.first();

		if (!habit) return response.notFound();

		// Habit doesn't belong to the currently autenticated user
		if (habit.user_id !== auth.user.id) return response.accessDenied();

		// We use different strategies to display trackable/untrackable habits
		const strategy = habit.is_trackable ? "trackable_habit" : "untrackable_habit";
		const detailedHabit = await DetailedHabitViewStrategies[strategy].execute(habit.id, timeZone);

		return response.send(detailedHabit);
	}

	async delete({params, response, auth}) {
		try {
			const numberOfDeletedHabits = await auth.user
				.habits()
				.where({id: params.id})
				.delete();

			if (!numberOfDeletedHabits) throw error;

			return response.send();
		} catch (error) {
			return response.accessDenied();
		}
	}

	async update({request, response, params, auth}) {
		const timeZone = request.header("timezone");

		const updatedHabitPayload = request.only(["name", "score", "strength", "description"]);

		const habit = await Habit.find(params.id);

		// Habit doesn't belong to the currently autenticated user
		if (habit.user_id !== auth.user.id) return response.accessDenied();

		try {
			await habit.merge(updatedHabitPayload);
			await habit.save();

			// We use different strategies to display trackable/untrackable habits
			const strategy = habit.is_trackable ? "trackable_habit" : "untrackable_habit";
			const detailedHabit = await DetailedHabitViewStrategies[strategy].execute(habit.id, timeZone);

			return response.send(detailedHabit);
		} catch (error) {
			if (error.message.includes("duplicate key value violates unique constraint")) {
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
