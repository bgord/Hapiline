const MAIN_ERROR_MESSAGES = use("MAIN_ERROR_MESSAGES");

class ValidateIndexesOrder {
	async handle({request, response}, next) {
		const {habits} = request.only(["habits"]);
		const indexes = habits.map(habit => habit.index);

		const sortedIndexes = [...indexes].sort((a, b) => a > b);

		const areIndexesInValidOrder = sortedIndexes.every((sortedIndex, i) => sortedIndex === i);

		if (areIndexesInValidOrder) return next();

		return response.validationError({
			message: MAIN_ERROR_MESSAGES.indexes_out_of_order,
		});
	}
}

module.exports = ValidateIndexesOrder;
