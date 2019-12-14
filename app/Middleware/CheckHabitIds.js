const Database = use("Database");

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
		else return next();
	}
}

module.exports = CheckHabitIds;
