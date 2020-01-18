/* eslint-disable sonarjs/no-identical-functions */

const HABITS_URL = "/habits";

describe("Habit", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("Add an item", () => {
		cy.clock();

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByLabelText("Habit").type("Wake up at 7:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByLabelText("Strength").select("fresh");

		cy.findByText("Add habit").click();
		cy.findByText("Habit successfully addedd!");

		cy.tick(10000);

		cy.findByText("Habit successfully addedd!").should("not.exist");

		cy.findByLabelText("Habit").should("have.value", "");
		cy.findByLabelText("Score").should("have.value", "positive");
		cy.findByLabelText("Strength").should("have.value", "established");

		cy.findByLabelText("Habit").type("Wake up at 7:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByLabelText("Strength").select("fresh");

		cy.findByText("Add habit").click();
		cy.findByText("Given habit already exists.");

		cy.findByLabelText("Habit")
			.clear()
			.type("Go to sleep at 9:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByLabelText("Strength").select("fresh");

		cy.findByText("Add habit").click();
		cy.findByText("Habit successfully addedd!");

		cy.findByText("Go to sleep at 9:30 AM");

		cy.findByLabelText("Habit")
			.clear()
			.type("That's too long");
		cy.findByLabelText("Score").select("positive");
		cy.findByLabelText("Strength").select("fresh");
		// 52 * 20 chars = 1040, which is grater than 1024
		cy.findByPlaceholderText("Write something...").type("That's what she said".repeat(52));
		cy.findByText("Add habit").click();
		cy.findByText("Description must be max of 1024 characters.");
	});

	it("500 while adding an item", () => {
		const errorMessage = "Unexpected error, try again later.";
		cy.server();
		cy.route({
			method: "POST",
			url: "/api/v1/habit",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByLabelText("Habit").type("Wake up at 7:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByText("Add habit").click();

		cy.findByText(errorMessage);
		cy.findByText("Habit couldn't be added.");
	});

	it("empty list of items", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: [],
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("Seems you haven't added any habits yet.");

		cy.findByText("Positive: 0").should("not.exist");
		cy.findByText("Neutral: 0").should("not.exist");
		cy.findByText("Negative: 0").should("not.exist");

		cy.findByText("Total: 0").should("not.exist");
	});

	it("renders returned items", () => {
		const response = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "established",
			},
			{
				id: 2,
				name: "Go to sleep",
				score: "neutral",
				strength: "fresh",
			},
			{
				id: 3,
				name: "Wake up",
				score: "negative",
				strength: "developing",
			},
		];

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response,
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			response.forEach(item => {
				cy.findByText(item.name);
				cy.findByText(item.score);
			});
		});

		cy.findByLabelText("Positive (1)").should("not.be.checked");
		cy.findByLabelText("Neutral (1)").should("not.be.checked");
		cy.findByLabelText("Negative (1)").should("not.be.checked");
		cy.findByLabelText("Established (1)").should("not.be.checked");
		cy.findByLabelText("Fresh (1)").should("not.be.checked");
		cy.findByLabelText("Developing (1)").should("not.be.checked");
		cy.findByLabelText("All scores (3)").should("be.checked");
		cy.findByLabelText("All strengths (3)").should("be.checked");
		cy.findByText("Results: 3");

		cy.findByLabelText("Positive (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByLabelText("Neutral (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByLabelText("Negative (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByLabelText("All scores (3)").check();

		cy.findByLabelText("Established (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByLabelText("Developing (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByLabelText("Fresh (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByLabelText("All strengths (3)").check();

		cy.findByPlaceholderText("Search for habits...")
			.should("have.value", "")
			.type("the");
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByText("Results: 1");

		cy.findByText("Clear").click();
		cy.findByPlaceholderText("Search for habits...").should("have.value", "");
	});

	it("error while getting items", () => {
		const errorMessage = "Error while getting the list.";

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText(errorMessage);
		cy.findByText("Couldn't fetch habit list.");
	});

	it("deleting items", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem");
		cy.findAllByText("Delete")
			.first()
			.click();
		cy.findByText("Nevermind, don't delete").click();
		cy.findByText("0 lorem");

		cy.findByText("Positive (4)");
		cy.findByText("Neutral (3)");
		cy.findByText("Negative (3)");
		cy.findByText("All scores (10)");

		cy.findAllByText("Delete")
			.first()
			.click();
		cy.findByText("Yes, delete").click();
		cy.findByText("0 lorem").should("not.exist");
		cy.findByText("Habit successfully deleted!");

		cy.findByText("Positive (3)");
		cy.findByText("Neutral (3)");
		cy.findByText("Negative (3)");
		cy.findByText("All scores (9)");
	});

	it("deleting habit error", () => {
		const errorMessage = "Couldn't delete habit.";

		cy.server();
		cy.route({
			method: "DELETE",
			url: "/api/v1/habit/6",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem");

		cy.findAllByText("Delete")
			.first()
			.click();

		cy.findByText("Yes, delete").click();

		cy.findByText("0 lorem").should("exist");
		cy.findByText(errorMessage);
	});

	it("inspecting habit details in modal", () => {
		const response = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "fresh",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				progress_streak: 2,
				regress_streak: 0,
			},
			{
				id: 2,
				name: "Go to sleep",
				score: "neutral",
				strength: "developing",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				progress_streak: 0,
				regress_streak: 1,
			},
		];

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response,
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit/1",
			status: 200,
			response: response[0],
		});

		const chartResponse = [
			{
				day: "2019-01-01",
				vote: "progress",
			},
			{
				day: "2019-01-02",
				vote: "regress",
			},
			{
				day: "2019-01-03",
				vote: "regress",
			},
			{
				day: "2019-01-04",
				vote: "progress",
			},
			{
				day: "2019-01-05",
				vote: "progress",
			},
			{
				day: "2019-01-06",
				vote: "progress",
			},
			{
				day: "2019-01-07",
				vote: "progress",
			},
		];
		cy.route({
			method: "GET",
			url: "/api/v1/habit-chart/1?dateRange=last_week",
			status: 200,
			response: chartResponse,
		});

		cy.route({
			method: "GET",
			url: "/api/v1/habit/2",
			status: 200,
			response: response[1],
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit-chart/2?dateRange=last_week",
			status: 500,
			response: [],
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("positive");
			cy.findByDisplayValue("fresh");
			cy.findByDisplayValue("Watch The Office");
			cy.findByText("2019/01/01 00:00");
			cy.findByText("2019/02/01 00:00");
			cy.findByText("Progress streak: 2 days");
			cy.findByDisplayValue("Last week");
			for (let {day, vote} of chartResponse) {
				cy.findByTitle(`${day} - ${vote}`);
			}
			cy.findByText("×").click();
		});

		cy.findAllByText("More")
			.eq(1)
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral");
			cy.findByDisplayValue("developing");
			cy.findByDisplayValue("Go to sleep");
			cy.findByText("2019/01/01 00:00");
			cy.findByText("2019/02/01 00:00");
			cy.findByText("Regress streak: 1 days");
			cy.findByDisplayValue("Last week");
			cy.findByText("Charts unavailable, please try again.");
		});

		cy.findByText("Fetching chart data failed.");
	});

	it("changing name", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		// "Save" flow
		cy.findByText("0 lorem xxx").should("not.exist");
		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Cancel");
		cy.findByText("Save").click();
		cy.findByText("Name updated successfully!");
		cy.findByRole("dialog").within(() => cy.findByText("×").click());

		cy.findByText("0 lorem xxx");
		cy.findByText("0 lorem").should("not.exist");

		// // Enter flow
		cy.findByText("1 loremlorem yyy").should("not.exist");
		cy.findAllByText("More")
			.eq(1)
			.click();

		cy.findByDisplayValue("1 loremlorem").type(" yyy{enter}");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Cancel").should("not.exist");
		cy.findAllByText("Name updated successfully!");
		cy.findByRole("dialog").within(() => cy.findByText("×").click());

		cy.findByText("1 loremlorem yyy");
		cy.findByText("1 loremlorem").should("not.exist");
	});

	it("cancel changing name", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" nono");
		cy.findByText("Cancel").click();
		cy.findByDisplayValue("0 lorem");

		cy.findByDisplayValue("0 lorem")
			.clear()
			.type("6 lorem");
		cy.findByText("Save").click();
		cy.findByText("Given habit already exists.");

		cy.findByText("Cancel").click();
		cy.findByDisplayValue("0 lorem");
	});

	it("changing name unique error", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem xxx").should("not.exist");
		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem")
			.clear()
			.type("9 lorem{enter}");

		cy.findByText("Given habit already exists.");

		cy.findByText("Save");
		cy.findByText("Cancel");
	});

	it("changing name error", () => {
		const errorMessage = "Error while chaning name.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/6",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Save").click();
		cy.findByText("Save");
		cy.findByText("Cancel");
		cy.findByText(errorMessage);

		cy.findByRole("dialog").within(() => cy.findByText("×").click());

		cy.findByDisplayValue("0 lorem xxx").should("not.exist");
	});

	it("changing scores", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral").select("positive");
			cy.findByText("×").click();
		});

		cy.findAllByText("Habit score changed successfully!");

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 5);
			cy.findAllByText("neutral").should("have.length", 2);
			cy.findAllByText("negative").should("have.length", 3);
		});
	});

	it("changing scores error", () => {
		const errorMessage = "Error while chaning name.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/7",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral").select("positive");
			cy.findByText("×").click();
		});

		cy.findAllByText("Habit score couldn't be changed.");

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);
		});
	});

	it("reordering habits (keyboard)", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByTestId("draggable-habit-item").should("have.length", 10);

		const expectedOrderBeforeDragAndDrop = [
			"0 lorem",
			"1 loremlorem",
			"2 loremloremlorem",
			"3 lorem",
			"4 loremlorem",
			"5 loremloremlorem",
			"6 lorem",
			"7 loremlorem",
			"8 loremloremlorem",
			"9 lorem",
		];
		expectedOrderBeforeDragAndDrop.forEach((_, index) => {
			cy.queryAllByTestId("draggable-habit-item")
				.eq(index)
				.should("contain.text", expectedOrderBeforeDragAndDrop[index]);
		});

		cy.get("ul").within(() => {
			cy.get("li:nth-child(1)")
				.focus()
				.trigger("keydown", {keyCode: 32})
				.trigger("keydown", {keyCode: 40, force: true})
				.trigger("keydown", {keyCode: 40, force: true})
				.trigger("keydown", {keyCode: 32, force: true});
		});

		cy.findByText("Habits reordered successfully!").click();

		const expectedOrderAfterDragAndDrop = [
			"1 loremlorem",
			"2 loremloremlorem",
			"0 lorem",
			"3 lorem",
			"4 loremlorem",
			"5 loremloremlorem",
			"6 lorem",
			"7 loremlorem",
			"8 loremloremlorem",
			"9 lorem",
		];
		expectedOrderAfterDragAndDrop.forEach((_, index) => {
			cy.queryAllByTestId("draggable-habit-item")
				.eq(index)
				.should("contain.text", expectedOrderAfterDragAndDrop[index]);
		});

		cy.reload().wait(1000);

		expectedOrderAfterDragAndDrop.forEach((_, index) => {
			cy.queryAllByTestId("draggable-habit-item")
				.eq(index)
				.should("contain.text", expectedOrderAfterDragAndDrop[index]);
		});
	});

	it("reordering habits (mouse)", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByTestId("draggable-habit-item").should("have.length", 10);

		const expectedOrderBeforeDragAndDrop = [
			"0 lorem",
			"1 loremlorem",
			"2 loremloremlorem",
			"3 lorem",
			"4 loremlorem",
			"5 loremloremlorem",
			"6 lorem",
			"7 loremlorem",
			"8 loremloremlorem",
			"9 lorem",
		];
		expectedOrderBeforeDragAndDrop.forEach((_, index) => {
			cy.queryAllByTestId("draggable-habit-item")
				.eq(index)
				.should("contain.text", expectedOrderBeforeDragAndDrop[index]);
		});

		cy.dragAndDrop("li:nth-child(1)", "li:nth-child(3)");

		cy.findByText("Habits reordered successfully!").click();

		const expectedOrderAfterDragAndDrop = [
			"1 loremlorem",
			"2 loremloremlorem",
			"0 lorem",
			"3 lorem",
			"4 loremlorem",
			"5 loremloremlorem",
			"6 lorem",
			"7 loremlorem",
			"8 loremloremlorem",
			"9 lorem",
		];
		expectedOrderAfterDragAndDrop.forEach((_, index) => {
			cy.queryAllByTestId("draggable-habit-item")
				.eq(index)
				.should("contain.text", expectedOrderAfterDragAndDrop[index]);
		});

		cy.reload().wait(1000);

		expectedOrderAfterDragAndDrop.forEach((_, index) => {
			cy.queryAllByTestId("draggable-habit-item")
				.eq(index)
				.should("contain.text", expectedOrderAfterDragAndDrop[index]);
		});
	});

	it("changing strengths", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("established").should("have.length", 4);
			cy.findAllByText("fresh").should("have.length", 3);
			cy.findAllByText("developing").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("developing").select("established");
			cy.findByText("×").click();
		});

		cy.findAllByText("Habit strength changed successfully!");

		cy.get("ul").within(() => {
			cy.findAllByText("established").should("have.length", 5);
			cy.findAllByText("fresh").should("have.length", 3);
			cy.findAllByText("developing").should("have.length", 2);
		});
	});

	it("changing description", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("xxx");

			cy.findByText("Save").click();
		});

		cy.findByText("Comment added successfully!");
	});

	it("changing description error", () => {
		const errorMessage = "Error while chaning description.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/7",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("xxx");

			cy.findByText("Save").click();
		});

		cy.findAllByText("Habit description couldn't be changed");
	});

	it("changing description inline error", () => {
		const errorMessage = "Error while chaning description.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/7",
			status: 400,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [
					{
						field: "description",
						validation: "max",
						message: "Too long description",
					},
				],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("xxx");

			cy.findByText("Save").click();
			cy.findByText("Too long description");
		});

		cy.findAllByText("Habit description couldn't be changed");
	});
});
