class ValidateIndexesOrder {
	async handle({auth, request, response}, next) {
		return next();
	}
}

module.exports = ValidateIndexesOrder;
