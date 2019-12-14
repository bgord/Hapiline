const Database = use("Database");
const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

class CheckHabitIds {
	async handle({auth, request, response}, next) {
		const allUserHabitIds = await Database.table("habits")
			.select("id")
			.where("user_id", auth.user.id)
			.map(entry => entry.id);

		const {habits} = request.only(["habits"]);
		const habitIds = habits.map(entry => entry.id);

		const doesEveryHabitIdBelongToUser = habitIds.every(habitId =>
			allUserHabitIds.includes(habitId),
		);

		if (!doesEveryHabitIdBelongToUser) return response.accessDenied();

		const areArraysIdentical =
			doesEveryHabitIdBelongToUser &&
			allUserHabitIds.every(userHabitId => habitIds.includes(userHabitId));

		if (!areArraysIdentical) {
			return response.validationError({
				message: MAIN_ERROR_MESSAGES.not_all_habit_ids_supplied,
			});
		}

		return next();
	}
}

module.exports = CheckHabitIds;
