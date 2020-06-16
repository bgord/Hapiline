const Database = use("Database");

class JournalController {
	async show({response, request, auth}) {
		const {day} = request.get();
		const [journal] = await Database.table("journals")
			.where("user_id", auth.user.id)
			.where("day", day);

		if (!journal) return response.notFound();

		return response.send(journal);
	}
}

module.exports = JournalController;
