const Database = use("Database");
const Journal = use("Journal");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const SORT_JOURNAL_BY_OPTIONS = use("SORT_JOURNAL_BY_OPTIONS");

class JournalController {
	async index({request, response, auth}) {
		const sort = request.get().sort;

		const orderByClauseToSort = {
			[SORT_JOURNAL_BY_OPTIONS.days_desc]: ["day", "desc"],
			[SORT_JOURNAL_BY_OPTIONS.days_asc]: ["day", "asc"],
		};

		const journals = await Database.table("journals")
			.where("user_id", auth.user.id)
			.where("content", "<>", "")
			.orderBy(...orderByClauseToSort[sort]);

		return response.send(journals);
	}

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

		const [{count: numberOfHabitsCreatedBeforeOrOnDay}] = await Database.table("habits")
			.where("user_id", auth.user.id)
			.where("created_at", "<=", day)
			.count("*");

		if (Number(numberOfHabitsCreatedBeforeOrOnDay) === 0) {
			return response.validationError({
				argErrors: [
					{
						message: VALIDATION_MESSAGES.same_or_after(
							"day",
							"day of the creation of the first habit",
						),
						field: "day",
						validation: "same_or_after",
					},
				],
			});
		}

		const [existingJournal] = await Database.table("journals")
			.where("user_id", auth.user.id)
			.where("day", day);

		if (existingJournal) {
			const journal = await Journal.find(existingJournal.id);
			journal.merge({content: content || ""});
			journal.save();

			return response.status(200).send(journal);
		}
		const createdJournal = await Journal.create({
			content: content || "",
			day,
			user_id: auth.user.id,
		});

		return response.status(201).send(createdJournal);
	}
}

module.exports = JournalController;
