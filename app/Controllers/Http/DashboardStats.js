const Database = use("Database");

class DashboardStatsController {
	async index({auth, response}) {
		const today = new Date();

		const _resultForToday = await Database.raw(
			`
      SELECT
        COUNT(*) FILTER (WHERE hv.vote = 'progress')::integer AS "progressVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'plateau')::integer AS "plateauVotes",
        COUNT(*) FILTER (WHERE hv.vote = 'regress')::integer AS "regressVotes",
        (
          SELECT COUNT(*)
          FROM habits as h
          WHERE h.created_at::date <= ? AND h.user_id = ?
        )::integer as "allHabits"
      FROM habit_votes as hv
      INNER JOIN habits as h ON hv.habit_id = h.id
      WHERE hv.day::date = ? AND h.user_id = ?
    `,
			[today, auth.user.id, today, auth.user.id],
		);

		const resultForToday = _resultForToday.rows[0];

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
		});
	}
}

module.exports = DashboardStatsController;
