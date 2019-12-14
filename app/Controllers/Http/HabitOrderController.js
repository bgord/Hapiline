class HabitsController {
	async update({response}) {
		return response.send();
	}
}

function calculateOrder(after) {
	return after.reduce((acc, curr) => {
		return {
			...acc,
			[curr.id]: {order: curr.index + 1},
		};
	}, {});
}

module.exports = HabitsController;
