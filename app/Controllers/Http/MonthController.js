const dateFns = require("date-fns");
const Database = use("Database");

class MonthsController {
	async show({request, response, auth}) {
		const monthOffset = Number(request.get().monthOffset);

		const today = Date.now();

		const date = dateFns.subMonths(today, monthOffset);

		const startOfGivenMonth = dateFns.startOfMonth(date);
		const endOfGivenMonth = dateFns.endOfMonth(date);

		const result = await Database.table("habits")
			.select(
				Database.raw("to_char(created_at::date, 'YYYY-MM-DD') as day"),
				Database.raw("count(*)::integer"),
			)
			.where("user_id", auth.user.id)
			.whereRaw(`created_at::date >= ?`, [startOfGivenMonth])
			.whereRaw(`created_at::date <= ?`, [endOfGivenMonth])
			.groupBy("day")
			.orderBy("day");

		return response.send(result);
	}
}

module.exports = MonthsController;
