const dateFns = require("date-fns");
const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

class MonthsController {
	async show({request, response, auth}) {
		const monthOffset = Number(request.get().monthOffset);

		const today = Date.now();

		const date = dateFns.subMonths(today, monthOffset);

		const startOfGivenMonth = dateFns.startOfMonth(date);
		const endOfGivenMonth = dateFns.endOfMonth(date);

		const createdHabitsCountResult = await Database.table("habits")
			.select(
				Database.raw("to_char(created_at::date, 'YYYY-MM-DD') as day"),
				Database.raw('count(*)::integer as "createdHabits"'),
			)
			.where("user_id", auth.user.id)
			.whereRaw(`created_at::date >= ?`, [startOfGivenMonth])
			.whereRaw(`created_at::date <= ?`, [endOfGivenMonth])
			.groupBy("day")
			.orderBy("day");

		const voteTypesCountResult = await Database.select(
			Database.raw("to_char(day::date, 'YYYY-MM-DD') as day"),
			Database.raw('count(*)::integer as "voteTypeCount"'),
			"vote as voteType",
		)
			.from("habit_votes")
			.whereRaw(`created_at::date >= ?`, [startOfGivenMonth])
			.whereRaw(`created_at::date <= ?`, [endOfGivenMonth])
			.whereIn(
				"habit_id",
				Database.select("id")
					.from("habits")
					.where("user_id", auth.user.id),
			)
			.groupBy("day")
			.groupBy("vote")
			.orderBy("day");

		const daysSet = new Set([
			...createdHabitsCountResult.map(entry => entry.day),
			...voteTypesCountResult.map(entry => entry.day),
		]);

		const days = [...daysSet].map(day => {
			const createdHabitsCountStats = createdHabitsCountResult.find(entry => entry.day === day);
			const progressVotesCountStats = voteTypesCountResult.find(
				entry => entry.day === day && entry.voteType === HABIT_VOTE_TYPES.progress,
			);
			const plateauVotesCountStats = voteTypesCountResult.find(
				entry => entry.day === day && entry.voteType === HABIT_VOTE_TYPES.plateau,
			);
			const regressVotesCountStats = voteTypesCountResult.find(
				entry => entry.day === day && entry.voteType === HABIT_VOTE_TYPES.regress,
			);
			const nullVotesCountStats = voteTypesCountResult.find(
				entry => entry.day === day && entry.voteType === null,
			);

			return {
				day,
				createdHabitsCount: createdHabitsCountStats ? createdHabitsCountStats.createdHabits : 0,
				progressVotesCountStats: progressVotesCountStats
					? progressVotesCountStats.voteTypeCount
					: 0,
				plateauVotesCountStats: plateauVotesCountStats ? plateauVotesCountStats.voteTypeCount : 0,
				regressVotesCountStats: regressVotesCountStats ? regressVotesCountStats.voteTypeCount : 0,
				nullVotesCountStats: nullVotesCountStats ? nullVotesCountStats.voteTypeCount : 0,
			};
		});

		return response.send(days);
	}
}

module.exports = MonthsController;
