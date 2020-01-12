const Database = use("Database");

class DayVoteController {
	async show({request, response, auth}) {
		const {day} = request.only(["day"]);

		const result = await Database.select(
			"hv.habit_id",
			"hv.vote",
			"hv.day",
			"hv.comment",
			"hv.id as vote_id",
		)
			.from("habit_votes as hv")
			.innerJoin("habits as h", "h.id", "hv.habit_id")
			.where({
				"h.user_id": auth.user.id,
				day,
			})
			.orderBy("hv.habit_id");

		return response.send(result);
	}
}

module.exports = DayVoteController;
