const dateFns = require("date-fns");
const Database = use("Database");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const get = require("lodash.get");

class MonthsController {
	async show({request, response, auth}) {
		// A number <= 0, which represents the offset in months
		// starting from the month that's `today`.
		const monthOffset = Number(request.get().monthOffset);

		// It represents the date that's in the month that we want to
		// take stats about.
		const dateInTheMonth = dateFns.subMonths(Date.now(), monthOffset);

		const startOfTheMonth = dateFns.startOfMonth(dateInTheMonth);
		const endOfTheMonth = dateFns.endOfMonth(dateInTheMonth);

		// An array of the following shape:
		// [{ day: '2020-06-11', numberOfHabits: 6 }]
		//
		// Includes only `day`s that have at least 1 created habit.
		const numberOfCreatedHabitsByDay = await Database.table("habits")
			.select(
				Database.raw("to_char(created_at::date, 'YYYY-MM-DD') as day"),
				Database.raw('count(*)::integer as "numberOfHabits"'),
			)
			.where("user_id", auth.user.id)
			.whereRaw(`created_at::date >= :startOfTheMonth`, {startOfTheMonth})
			.whereRaw(`created_at::date <= :endOfTheMonth`, {endOfTheMonth})
			.groupBy("day")
			.orderBy("day");

		// An array of the following shape:
		// [
		//    { day: '2020-06-13', numberOfVotes: 1, voteType: 'plateau' },
		//    { day: '2020-06-13', numberOfVotes: 6, voteType: 'progress' },
		//    { day: '2020-06-13', numberOfVotes: 6, voteType: 'regress' },
		//    { day: '2020-06-13', numberOfVotes: 1, voteType: null },
		// ]
		//
		// Includes only `day`s that have at least one vote per given type.
		const numberOfVoteTypesByDay = await Database.select(
			Database.raw("to_char(day::date, 'YYYY-MM-DD') as day"),
			Database.raw('count(*)::integer as "numberOfVotes"'),
			"vote as voteType",
		)
			.from("habit_votes")
			.whereRaw(`day::date >= :startOfTheMonth`, {startOfTheMonth})
			.whereRaw(`day::date <= :endOfTheMonth`, {endOfTheMonth})
			.whereIn(
				"habit_id",
				Database.select("id")
					.from("habits")
					.where("user_id", auth.user.id),
			)
			.groupBy("day")
			.groupBy("vote")
			.orderBy("day");

		const daysWithAtLeastOneStat = new Set([
			...numberOfCreatedHabitsByDay.map(entry => entry.day),
			...numberOfVoteTypesByDay.map(entry => entry.day),
		]);

		// Calculate stats and massage them so that
		// they either contain the number we're looking for or 0.
		const statsForDaysWithAtLeastOneCreatedHabitOrVote = [...daysWithAtLeastOneStat].map(day => {
			const habitsCreatedByDay = numberOfCreatedHabitsByDay.find(
				entry => entry && entry.day === day,
			);

			const progressVotesByDay = numberOfVoteTypesByDay.find(
				getByDayAndVoteType(HABIT_VOTE_TYPES.progress),
			);

			const plateauVotesByDay = numberOfVoteTypesByDay.find(
				getByDayAndVoteType(HABIT_VOTE_TYPES.plateau),
			);

			const regressVotesByDay = numberOfVoteTypesByDay.find(
				getByDayAndVoteType(HABIT_VOTE_TYPES.regress),
			);

			function getByDayAndVoteType(voteType) {
				return entry => entry && entry.day === day && entry.voteType === voteType;
			}

			return {
				day,
				numberOfCreatedHabits: get(habitsCreatedByDay, "numberOfHabits", 0),
				numberOfProgressVotes: get(progressVotesByDay, "numberOfVotes", 0),
				numberOfPlateauVotes: get(plateauVotesByDay, "numberOfVotes", 0),
				numberOfRegressVotes: get(regressVotesByDay, "numberOfVotes", 0),
			};
		});

		return response.send(statsForDaysWithAtLeastOneCreatedHabitOrVote);
	}
}

module.exports = MonthsController;
