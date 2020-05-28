const {test} = use("Test/Suite")("VotesStreakCalculator");
const {VotesStreakCalculator} = require("../../app/Beings/VotesStreakCalculator");
const dateFns = require("date-fns");

const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const today = new Date();
const yesterday = dateFns.subDays(today, 1);
const dayBeforeYesterday = dateFns.subDays(today, 2);

test("it works as expected", async ({assert}) => {
	const cases = [
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

		// `null` vote resets the streak
		[[HABIT_VOTE_TYPES.progress, null, HABIT_VOTE_TYPES.progress], 1, HABIT_VOTE_TYPES.progress],

		// `plateau` resets the streak
		[
			[HABIT_VOTE_TYPES.progress, HABIT_VOTE_TYPES.plateau, HABIT_VOTE_TYPES.plateau],
			0,
			HABIT_VOTE_TYPES.progress,
		],
	];

	for (const [votes, expected, voteType] of cases) {
		const dates = [today, yesterday, dayBeforeYesterday];

		const payload = votes.map((vote, index) => ({
			day: dates[index],
			vote,
		}));

		const streaksCalculator = new VotesStreakCalculator(payload);
		const result = streaksCalculator.calculate(voteType);

		assert.equal(result, expected);
	}
});
