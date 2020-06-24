const Database = use("Database");
const get = require("lodash.get");

class DashboardStatsController {
	async index({auth, response}) {
		const numberOfPossibleVotesLastDay = await getNumberOfPossibleVotesForDateInterval({
			user_id: auth.user.id,
			strategy: "last_day",
		});
		const resultForToday = await getVoteStatsForDateInterval({
			user_id: auth.user.id,
			strategy: "last_day",
		});

		const numberOfPossibleVotesLastWeek = await getNumberOfPossibleVotesForDateInterval({
			user_id: auth.user.id,
			strategy: "last_week",
		});
		const resultForLastWeek = await getVoteStatsForDateInterval({
			user_id: auth.user.id,
			strategy: "last_week",
		});

		const numberOfPossibleVotesLastMonth = await getNumberOfPossibleVotesForDateInterval({
			user_id: auth.user.id,
			strategy: "last_month",
		});
		const resultForLastMonth = await getVoteStatsForDateInterval({
			user_id: auth.user.id,
			strategy: "last_month",
		});

		return response.send({
			today: {
				...resultForToday,
				numberOfMissingVotes: getNumberOfMissingVotes(numberOfPossibleVotesLastDay, resultForToday),
				numberOfNonEmptyVotes: getNumberOfNonEmptyVotes(resultForToday),
				numberOfPossibleVotes: numberOfPossibleVotesLastDay,
			},
			lastWeek: {
				...resultForLastWeek,
				numberOfMissingVotes: getNumberOfMissingVotes(
					numberOfPossibleVotesLastWeek,
					resultForLastWeek,
				),
				numberOfNonEmptyVotes: getNumberOfNonEmptyVotes(resultForLastWeek),
				numberOfPossibleVotes: numberOfPossibleVotesLastWeek,
			},
			lastMonth: {
				...resultForLastMonth,
				numberOfMissingVotes: getNumberOfMissingVotes(
					numberOfPossibleVotesLastMonth,
					resultForLastMonth,
				),
				numberOfNonEmptyVotes: getNumberOfNonEmptyVotes(resultForLastMonth),
				numberOfPossibleVotes: numberOfPossibleVotesLastMonth,
			},
		});
	}
}

async function getNumberOfPossibleVotesForDateInterval({user_id, strategy}) {
	function getOffsetForStrategy(strategy) {
		if (strategy === "last_month") return "29 days";
		if (strategy === "last_week") return "6 days";
		if (strategy === "last_day") return "0 days";

		throw new Error(`Unknown strategy: ${strategy}`);
	}

	const result = await Database.raw(
		`
      SELECT
        SUM(COUNT(habits.*) FILTER (WHERE habits.created_at::date <= day))
        OVER (ORDER BY day)::integer AS "numberOfPossibleVotes"
      FROM GENERATE_SERIES(NOW() - :offset::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date <= day::date
      WHERE habits.user_id = :user_id AND habits.is_trackable IS TRUE
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1
      `,
		{user_id, offset: getOffsetForStrategy(strategy)},
	);

	return get(result, "rows[0].numberOfPossibleVotes", 0);
}

async function getVoteStatsForDateInterval({user_id, strategy}) {
	function getOffsetForStrategy(strategy) {
		if (strategy === "last_month") return "29 days";
		if (strategy === "last_week") return "6 days";
		if (strategy === "last_day") return "0 days";

		throw new Error(`Unknown strategy: ${strategy}`);
	}

	const result = await Database.raw(
		`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "numberOfProgressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "numberOfPlateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "numberOfRegressVotes"
      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE
        h.user_id = :user_id AND
        hv.day::date >= NOW()::date - :offset::interval AND
        hv.day::date <= NOW()::date
		`,
		{user_id, offset: getOffsetForStrategy(strategy)},
	);

	return result.rows[0];
}

function getNumberOfNonEmptyVotes(resultForTimePeriod) {
	return (
		get(resultForTimePeriod, "numberOfProgressVotes", 0) +
		get(resultForTimePeriod, "numberOfPlateauVotes", 0) +
		get(resultForTimePeriod, "numberOfRegressVotes", 0)
	);
}

function getNumberOfMissingVotes(_maximum, resultForTimePeriod) {
	const maximum = _maximum || 0;

	if (maximum === 0) return 0;

	return (
		maximum -
		get(resultForTimePeriod, "numberOfProgressVotes", 0) -
		get(resultForTimePeriod, "numberOfPlateauVotes", 0) -
		get(resultForTimePeriod, "numberOfRegressVotes", 0)
	);
}

module.exports = DashboardStatsController;
