const Database = use("Database");

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
        hv.created_at::date >= NOW()::date - '6 days'::interval AND
        hv.created_at::date <= NOW()::date
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
        hv.created_at::date >= NOW()::date - '29 days'::interval AND
        hv.created_at::date <= NOW()::date
		`,
			{user_id: auth.user.id},
		);
		const resultForLastMonth = _resultForLastMonth.rows[0];

		return response.send({
			today: {
				...resultForToday,
				noVotes:
					resultForToday.maximumVotes -
						resultForToday.progressVotes -
						resultForToday.plateauVotes -
						resultForToday.regressVotes || 0,
				allVotes:
					resultForToday.progressVotes + resultForToday.plateauVotes + resultForToday.regressVotes,
			},
			lastWeek: {
				...resultForLastWeek,
				noVotes:
					maximumVotesLastWeek -
						resultForLastWeek.progressVotes -
						resultForLastWeek.plateauVotes -
						resultForLastWeek.regressVotes || 0,
				allVotes:
					resultForLastWeek.progressVotes +
					resultForLastWeek.plateauVotes +
					resultForLastWeek.regressVotes,
				maximumVotes: maximumVotesLastWeek || 0,
			},
			lastMonth: {
				...resultForLastMonth,
				noVotes:
					maximumVotesLastMonth -
						resultForLastMonth.progressVotes -
						resultForLastMonth.plateauVotes -
						resultForLastMonth.regressVotes || 0,
				allVotes:
					resultForLastMonth.progressVotes +
					resultForLastMonth.plateauVotes +
					resultForLastMonth.regressVotes,
				maximumVotes: maximumVotesLastMonth || 0,
			},
		});
	}
}

module.exports = DashboardStatsController;
