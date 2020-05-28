const {test} = use("Test/Suite")("VotesStreakCalculator");
const {VotesStreakCalculator} = require("../../app/Beings/VotesStreakCalculator");
const dateFns = require("date-fns");

const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const today = new Date();
const yesterday = dateFns.subDays(today, 1);
const dayBeforeYesterday = dateFns.subDays(today, 2);

test("it works as expected", async ({assert}) => {
	const cases = [
		[
			[
				{
					day: today,
					vote: null,
				},
				{
					day: yesterday,
					vote: null,
				},
				{
					day: dayBeforeYesterday,
					vote: null,
				},
			],
			0,
			HABIT_VOTE_TYPES.progress,
		],
	];

	for (const [payload, expected, voteType] of cases) {
		const streaksCalculator = new VotesStreakCalculator(payload);
		const result = streaksCalculator.calculate(voteType);

		assert.equal(result, expected);
	}
});
