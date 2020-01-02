const Habit = use("Habit");

class HabitsController {
	async show({params, response, auth}) {
		const id = Number(params.id);

		const habit = await Habit.find(id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		return response.send();
	}
}

module.exports = HabitsController;
