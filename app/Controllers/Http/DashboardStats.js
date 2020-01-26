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
          WHERE h.created_at::date <= NOW()::date AND h.user_id = :user_id
        )::integer as "allHabits"
      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE hv.day::date = NOW()::date AND h.user_id = :user_id
    `,
			{user_id: auth.user.id},
		);
		const resultForToday = _resultForToday.rows[0];

		const _resultForMaximumVotesLastWeek = await Database.raw(
			`
      SELECT SUM(COUNT(habits.*)) OVER (ORDER BY day)::integer AS habit_count
      FROM GENERATE_SERIES(NOW() - '6 days'::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date = day::date
      WHERE habits.user_id = :user_id
      GROUP BY day
      `,
			{user_id: auth.user.id},
		);
		const maximumVotesLastWeek = _resultForMaximumVotesLastWeek.rows
			.map(item => item.habit_count)
			.reduce(add, 0);

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
      SELECT SUM(COUNT(habits.*)) OVER (ORDER BY day)::integer AS habit_count
      FROM GENERATE_SERIES(NOW() - '29 days'::interval, NOW(), '1 day') as day
      LEFT JOIN habits ON habits.created_at::date = day::date
      WHERE habits.user_id = :user_id
      GROUP BY day
      `,
			{user_id: auth.user.id},
		);
		const maximumVotesLastMonth = _resultForMaximumVotesLastMonth.rows
			.map(item => item.habit_count)
			.reduce(add, 0);

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
					resultForToday.allHabits -
					resultForToday.progressVotes -
					resultForToday.plateauVotes -
					resultForToday.regressVotes,
				allVotes:
					resultForToday.progressVotes + resultForToday.plateauVotes + resultForToday.regressVotes,
			},
			lastWeek: {
				...resultForLastWeek,
				noVotes:
					maximumVotesLastWeek -
					resultForLastWeek.progressVotes -
					resultForLastWeek.plateauVotes -
					resultForLastWeek.regressVotes,
				allVotes:
					resultForLastWeek.progressVotes +
					resultForLastWeek.plateauVotes +
					resultForLastWeek.regressVotes,
				maximumVotes: maximumVotesLastWeek,
			},
			lastMonth: {
				...resultForLastMonth,
				noVotes:
					maximumVotesLastWeek -
					resultForLastMonth.progressVotes -
					resultForLastMonth.plateauVotes -
					resultForLastMonth.regressVotes,
				allVotes:
					resultForLastMonth.progressVotes +
					resultForLastMonth.plateauVotes +
					resultForLastMonth.regressVotes,
				maximumVotes: maximumVotesLastMonth,
			},
		});
	}
}

function add(a, b) {
	return a + b;
}

module.exports = DashboardStatsController;
