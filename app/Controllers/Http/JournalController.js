const Database = use("Database");
const Journal = use("Journal");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");

class JournalController {
	async show({response, request, auth}) {
		const {day} = request.get();
		const [journal] = await Database.table("journals")
			.where("user_id", auth.user.id)
			.where("day", day);

		if (!journal) return response.notFound();

		return response.send(journal);
	}

	async store({response, request, auth}) {
		const {day, content} = request.only(["day", "content"]);

		const [{count: numberOfHabitsCreatedBeforeDay}] = await Database.table("habits")
			.where("user_id", auth.user.id)
			.where("created_at", "<=", day)
			.count("*");
		if (Number(numberOfHabitsCreatedBeforeDay) === 0) {
			return response.validationError({
				argErrors: [
					{
						message: VALIDATION_MESSAGES.sameOrAfter("day", "Day of creation of the first habit"),
						field: "day",
						validation: "sameOrAfter",
					},
				],
			});
		}
		const [_journal] = await Database.table("journals")
			.where("user_id", auth.user.id)
			.where("day", day);
		if (_journal) {
			const journal = await Journal.find(_journal.id);
			journal.merge({content});
			journal.save();
			return response.status(200).send(journal);
		}
		const result = await Journal.create({
			content,
			day,
			user_id: auth.user.id,
		});
		return response.status(201).send(result);
	}
}

module.exports = JournalController;
