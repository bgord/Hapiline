const Database = use("Database");
const get = require("lodash.get");

class DashboardStatsController {
	async index({auth, response}) {
		const _resultForToday = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "numberOfProgressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "numberOfPlateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "numberOfRegressVotes",

        (
          SELECT COUNT(*)
          FROM habits as h
          WHERE
            h.created_at::date <= NOW()::date
            AND h.user_id = :user_id
            AND h.is_trackable IS TRUE
        )::integer as "numberOfPossibleVotes",

        (
          SELECT COUNT(*)
          FROM habits as h
          WHERE
            h.created_at::date <= NOW()::date
            AND h.user_id = :user_id
            AND h.is_trackable IS FALSE
        )::integer as "numberOfUntrackedHabits"

      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE hv.day::date = NOW()::date AND h.user_id = :user_id
    `,
			{user_id: auth.user.id},
		);
		const resultForToday = _resultForToday.rows[0];

		const _numberOfPossibleVotesLastWeek = await Database.raw(
			`
      SELECT
        SUM(COUNT(habits.*) FILTER (WHERE habits.created_at::date <= day))
        OVER (ORDER BY day)::integer AS "numberOfPossibleVotesLastWeek"
      FROM GENERATE_SERIES(NOW() - '6 days'::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date <= day::date
      WHERE habits.user_id = :user_id AND habits.is_trackable IS TRUE
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1
      `,
			{user_id: auth.user.id},
		);
		const {numberOfPossibleVotesLastWeek} = _numberOfPossibleVotesLastWeek.rows[0] || 0;

		const _resultForLastWeek = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "numberOfProgressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "numberOfPlateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "numberOfRegressVotes"
      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE
        h.user_id = :user_id AND
        hv.day::date >= NOW()::date - '6 days'::interval AND
        hv.day::date <= NOW()::date
		`,
			{user_id: auth.user.id},
		);
		const resultForLastWeek = _resultForLastWeek.rows[0];

		const _numberOfPossibleVotesLastMonth = await Database.raw(
			`
      SELECT
        SUM(COUNT(habits.*) FILTER (WHERE habits.created_at::date <= day))
        OVER (ORDER BY day)::integer AS "numberOfPossibleVotesLastMonth"
      FROM GENERATE_SERIES(NOW() - '29 days'::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date <= day::date
      WHERE habits.user_id = :user_id AND habits.is_trackable IS TRUE
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1
      `,
			{user_id: auth.user.id},
		);
		const {numberOfPossibleVotesLastMonth} = _numberOfPossibleVotesLastMonth.rows[0] || 0;

		const _resultForLastMonth = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "numberOfProgressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "numberOfPlateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "numberOfRegressVotes"
      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE
        h.user_id = :user_id AND
        hv.day::date >= NOW()::date - '29 days'::interval AND
        hv.day::date <= NOW()::date
		`,
			{user_id: auth.user.id},
		);
		const resultForLastMonth = _resultForLastMonth.rows[0];

		return response.send({
			today: {
				...resultForToday,
				numberOfMissingVotes: getNumberOfMissingVotes(
					resultForToday.numberOfPossibleVotes,
					resultForToday,
				),
				numberOfNonEmptyVotes: getNumberOfNonEmptyVotes(resultForToday),
			},
			lastWeek: {
				...resultForLastWeek,
				numberOfMissingVotes: getNumberOfMissingVotes(
					numberOfPossibleVotesLastWeek,
					resultForLastWeek,
				),
				numberOfNonEmptyVotes: getNumberOfNonEmptyVotes(resultForLastWeek),
				numberOfPossibleVotes: numberOfPossibleVotesLastWeek || 0,
			},
			lastMonth: {
				...resultForLastMonth,
				numberOfMissingVotes: getNumberOfMissingVotes(
					numberOfPossibleVotesLastMonth,
					resultForLastMonth,
				),
				numberOfNonEmptyVotes: getNumberOfNonEmptyVotes(resultForLastMonth),
				numberOfPossibleVotes: numberOfPossibleVotesLastMonth || 0,
			},
		});
	}
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
