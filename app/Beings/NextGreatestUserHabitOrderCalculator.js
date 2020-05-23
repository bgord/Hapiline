const Database = use("Database");

// Each habit has an `order` column, which used
// used to properly display the habit list.
//
// When creating a new habit, we want to
// append it to the list.
//
// Hence the need to know the highest current order
// for given user.

class NextGreatestUserHabitOrderCalculator {
	constructor({userId}) {
		this.userId = userId;
	}

	async calculate() {
		const {maxOrderValue} = await Database.table("habits")
			.max("order as maxOrderValue")
			.where("user_id", this.userId)
			.first();

		return maxOrderValue + 1;
	}
}

module.exports = {NextGreatestUserHabitOrderCalculator};
