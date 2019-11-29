const {test} = use("Test/Suite")("skip()");

const _ = use("Utils");

test("works properly in all cases", async ({assert}) => {
	const cases = [
		[["data"], {data: "response", error: null}, {error: null}],
		[["data", "error"], {data: "response", error: null}, {}],
		[["data", "error", "xxx"], {data: "response", error: null}, {}],
		[[], {data: "response", error: null}, {data: "response", error: null}],
		[["xxx"], {data: "response", error: null}, {data: "response", error: null}],
		[["xxx"], {}, {}],
	];

	cases.forEach(([keys, object, expected]) => {
		const result = _.skip(keys, object);
		assert.deepEqual(result, expected);
	});
});
