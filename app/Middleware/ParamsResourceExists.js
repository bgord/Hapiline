const Database = use("Database");

class ParamsResourceExists {
	async handle({response, params}, next, properties) {
		const [table, column] = properties;
		const {id} = params;

		try {
			const {count} = await Database.table(table)
				.count("*")
				.where({
					[column]: id,
				})
				.first();

			if (parseInt(count, 10) > 0) {
				return next();
			}
			throw new Error();
		} catch (error) {
			response.unprocessableEntity();
		}
	}
}

module.exports = ParamsResourceExists;
