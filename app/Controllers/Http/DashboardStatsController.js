const Database = use("Database");
const get = require("lodash.get");

class DashboardStatsController {
	async index({auth, response}) {
		const _resultForToday = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "progressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "plateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "regressVotes",

        (
          SELECT COUNT(*)
          FROM habits as h
          WHERE
            h.created_at::date <= NOW()::date
            AND h.user_id = :user_id
            AND h.is_trackable IS TRUE
        )::integer as "maximumVotes",

        (
          SELECT COUNT(*)
          FROM habits as h
          WHERE
            h.created_at::date <= NOW()::date
            AND h.user_id = :user_id
            AND h.is_trackable IS FALSE
        )::integer as "untrackedHabits"

      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE hv.day::date = NOW()::date AND h.user_id = :user_id
    `,
			{user_id: auth.user.id},
		);
		const resultForToday = _resultForToday.rows[0];

		const _resultForMaximumVotesLastWeek = await Database.raw(
			`
      SELECT
        SUM(COUNT(habits.*) FILTER (WHERE habits.created_at::date <= day))
        OVER (ORDER BY day)::integer AS "maximumVotesLastWeek"
      FROM GENERATE_SERIES(NOW() - '6 days'::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date <= day::date
      WHERE habits.user_id = :user_id AND habits.is_trackable IS TRUE
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1
      `,
			{user_id: auth.user.id},
		);
		const {maximumVotesLastWeek} = _resultForMaximumVotesLastWeek.rows[0] || 0;

		const _resultForLastWeek = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "progressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "plateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "regressVotes"
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

		const _resultForMaximumVotesLastMonth = await Database.raw(
			`
      SELECT
        SUM(COUNT(habits.*) FILTER (WHERE habits.created_at::date <= day))
        OVER (ORDER BY day)::integer AS "maximumVotesLastMonth"
      FROM GENERATE_SERIES(NOW() - '29 days'::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date <= day::date
      WHERE habits.user_id = :user_id AND habits.is_trackable IS TRUE
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1
      `,
			{user_id: auth.user.id},
		);
		const {maximumVotesLastMonth} = _resultForMaximumVotesLastMonth.rows[0] || 0;

		const _resultForLastMonth = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "progressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "plateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "regressVotes"
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
				noVotes: getNumberOfMissingVotes(resultForToday.maximumVotes, resultForToday),
				allVotes: getNumberOfAllVotes(resultForToday),
			},
			lastWeek: {
				...resultForLastWeek,
				noVotes: getNumberOfMissingVotes(maximumVotesLastWeek, resultForLastWeek),
				allVotes: getNumberOfAllVotes(resultForLastWeek),
				maximumVotes: maximumVotesLastWeek || 0,
			},
			lastMonth: {
				...resultForLastMonth,
				noVotes: getNumberOfMissingVotes(maximumVotesLastMonth, resultForLastMonth),
				allVotes: getNumberOfAllVotes(resultForLastMonth),
				maximumVotes: maximumVotesLastMonth || 0,
			},
		});
	}
}

function getNumberOfAllVotes(resultForTimePeriod) {
	return (
		get(resultForTimePeriod, "progressVotes", 0) +
		get(resultForTimePeriod, "plateauVotes", 0) +
		get(resultForTimePeriod, "regressVotes", 0)
	);
}

function getNumberOfMissingVotes(_maximum, resultForTimePeriod) {
	const maximum = _maximum || 0;

	if (maximum === 0) return 0;

	return (
		maximum -
		get(resultForTimePeriod, "progressVotes", 0) -
		get(resultForTimePeriod, "plateauVotes", 0) -
		get(resultForTimePeriod, "regressVotes", 0)
	);
}

module.exports = DashboardStatsController;
