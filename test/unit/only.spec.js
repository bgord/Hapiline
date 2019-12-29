const {test} = use("Test/Suite")("only()");

const _ = use("Utils");

test("works properly in all cases", async ({assert}) => {
	const cases = [
		[[], {data: "response", error: null}, {}],
		[["data"], {data: "response", error: null}, {data: "response"}],
		[["data", "error"], {data: "response", error: null}, {data: "response", error: null}],
		[
			["data", "error", "message"],
			{data: "response", error: null},
			{data: "response", error: null},
		],
	];

	cases.forEach(([keys, object, expected]) => {
		const result = _.only(keys, object);
		assert.deepEqual(result, expected);
	});
});
