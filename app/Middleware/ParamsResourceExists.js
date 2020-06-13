const Database = use("Database");

class ParamsResourceExists {
	async handle({response, params}, next, properties) {
		const [table, column] = properties;
		const {id} = params;

		try {
			const {count: numberOfResults} = await Database.table(table)
				.count("*")
				.where({
					[column]: id,
				})
				.first();

			if (parseInt(numberOfResults, 10) > 0) {
				return next();
			}
			throw new Error();
		} catch (error) {
			return response.unprocessableEntity();
		}
	}
}

module.exports = ParamsResourceExists;
