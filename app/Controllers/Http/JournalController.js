const Database = use("Database");

class JournalController {
	async show({params, response, auth}) {
		const journal = await Database.table("journals")
			.where("user_id", auth.user.id)
			.where("day", params.day);

		if (!journal) return response.notFound();

		return response.send(journal);
	}
}

module.exports = JournalController;
