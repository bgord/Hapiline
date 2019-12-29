class MonthsController {
	async show({params, response}) {
		const {monthOffset} = params;
		console.log(monthOffset);
		return response.send();
	}
}

module.exports = MonthsController;
