const {test} = use("Test/Suite")("VotesStreakCalculator");
const {orderByDescendingStreak} = require("../../app/Beings/orderByDescendingStreak");

test("it works as expected", async ({assert}) => {
	const cases = [
		[
			// If two streaks has the same value,
			// it returns those without votes for today first.
			[
				{progress_streak: 3, has_vote_for_today: true},
				{progress_streak: 3, has_vote_for_today: false},
				{progress_streak: 3, has_vote_for_today: true},
			],
			[
				{progress_streak: 3, has_vote_for_today: false},
				{progress_streak: 3, has_vote_for_today: true},
				{progress_streak: 3, has_vote_for_today: true},
			],
		],

		[
			[
				{progress_streak: 3, has_vote_for_today: false},
				{progress_streak: 4, has_vote_for_today: true},
				{progress_streak: 3, has_vote_for_today: true},
			],
			[
				{progress_streak: 4, has_vote_for_today: true},
				{progress_streak: 3, has_vote_for_today: false},
				{progress_streak: 3, has_vote_for_today: true},
			],
		],
	];

	for (const [payload, expected] of cases) {
		const result = Array.from(payload).sort(orderByDescendingStreak("progress_streak"));

		assert.deepEqual(result, expected);
	}
});
