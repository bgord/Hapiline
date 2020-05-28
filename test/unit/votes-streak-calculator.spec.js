const {test} = use("Test/Suite")("VotesStreakCalculator");
const {VotesStreakCalculator} = require("../../app/Beings/VotesStreakCalculator");
const dateFns = require("date-fns");

const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

test("it works as expected", async ({assert}) => {
	const cases = [
		// Votes are for: today, yesterday, day before yesterday, etc...

		[[null, null, null], 0, HABIT_VOTE_TYPES.progress],

		// Basic 3 straight days
		[
			[HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress],
			3,
			HABIT_VOTE_TYPES.progress,
		],

		// Check if it doesn't return same results for both regress and progress
		[
			[HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress],
			0,
			HABIT_VOTE_TYPES.regress,
		],

		// `null` vote resets the streak if today has a non-null breaking vote
		[
			[HABIT_VOTE_TYPES.regress, null, HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress],
			0,
			HABIT_VOTE_TYPES.progress,
		],

		// `plateau` resets the streak
		[
			[
				HABIT_VOTE_TYPES.progress,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.plateau,
			],
			1,
			HABIT_VOTE_TYPES.progress,
		],

		// `null` doesn't reset the streak because today has `null` vote
		[[null, HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress], 2, HABIT_VOTE_TYPES.progress],

		// two `null`s reset the streak
		[
			[null, null, HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress],
			0,
			HABIT_VOTE_TYPES.progress,
		],

		// One `null` in between desired values doesn't break the streak
		[
			[HABIT_VOTE_TYPES.progress, null, HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.progress],
			3,
			HABIT_VOTE_TYPES.progress,
		],

		// Two `null`s in between desired values break the streak
		[
			[HABIT_VOTE_TYPES.progress, null, null, HABIT_VOTE_TYPES.progress],
			1,
			HABIT_VOTE_TYPES.progress,
		],

		// Two `null`s in between desired values break the streak
		[
			[HABIT_VOTE_TYPES.regress, null, null, HABIT_VOTE_TYPES.progress],
			0,
			HABIT_VOTE_TYPES.progress,
		],

		// One `plateau` in between desired values doesn't break the streak
		[
			[
				HABIT_VOTE_TYPES.progress,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.progress,
				HABIT_VOTE_TYPES.progress,
			],
			3,
			HABIT_VOTE_TYPES.progress,
		],

		// Two `plateau`s in between desired values break the streak
		[
			[
				HABIT_VOTE_TYPES.progress,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.progress,
			],
			1,
			HABIT_VOTE_TYPES.progress,
		],

		// Two `plateau`s in between desired values break the streak
		[
			[
				HABIT_VOTE_TYPES.regress,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.plateau,
				HABIT_VOTE_TYPES.progress,
			],
			0,
			HABIT_VOTE_TYPES.progress,
		],

		[
			[HABIT_VOTE_TYPES.regress, null, HABIT_VOTE_TYPES.plateau, HABIT_VOTE_TYPES.regress],
			1,
			HABIT_VOTE_TYPES.regress,
		],

		// `null` today doesn't break the streak if there's a correct vote the day before
		[
			[null, HABIT_VOTE_TYPES.plateau, HABIT_VOTE_TYPES.regress, HABIT_VOTE_TYPES.regress],
			0,
			HABIT_VOTE_TYPES.regress,
		],
	];

	for (const [votes, expected, voteType] of cases) {
		const payload = votes.map((vote, index) => ({
			day: dateFns.subDays(new Date(), index),
			vote,
		}));

		const streaksCalculator = new VotesStreakCalculator(payload);
		const result = streaksCalculator.calculate(voteType);

		assert.equal(result, expected);
	}
});
