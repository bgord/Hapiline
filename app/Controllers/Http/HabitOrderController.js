const Database = use("Database");
const Habit = use("Habit");
const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

class HabitOrderController {
	async update({request, response}) {
		const {habits} = request.only(["habits"]);

		const trx = await Database.beginTransaction();

		try {
			for (let {id, index} of habits) {
				const habit = await Habit.find(id, trx);
				habit.merge({
					order: index,
				});
				await habit.save();
			}

			return response.send();
		} catch (e) {
			trx.rollback();
			return response.internalSeverError({
				message: MAIN_ERROR_MESSAGES.cannot_reorder_habits,
			});
		}
	}
}

module.exports = HabitOrderController;
