/* eslint-disable sonarjs/no-identical-functions */

const HABITS_URL = "/habits";

describe("Habit", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("Add a habit", () => {
		cy.clock();

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("New habit").click();
		cy.url().should("contain", "/habits?subview=add_habit");

		cy.findByRole("dialog").within(() => {
			cy.findByText("New habit");
			cy.findByLabelText("Habit name").type("Wake up at 7:30 AM");
			cy.findByLabelText("Score").select("positive");
			cy.findByLabelText("Strength").select("fresh");

			cy.findByText("You won't be able to vote for an untracked habit.");

			cy.findByText("Add habit").click();
		});

		cy.findByText("Habit successfully addedd!");

		cy.tick(10000);

		cy.findByText("Habit successfully addedd!").should("not.exist");

		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").should("be.empty");
			cy.findByLabelText("Score").should("have.value", "positive");
			cy.findByLabelText("Strength").should("have.value", "established");

			cy.findByLabelText("Habit name").type("Wake up at 7:30 AM");
			cy.findByLabelText("Score").select("positive");
			cy.findByLabelText("Strength").select("fresh");

			cy.findByText("Add habit").click();

			cy.findByText("Given habit already exists.");

			cy.findByLabelText("Habit name")
				.clear()
				.type("Go to sleep at 9:30 AM");
			cy.findByLabelText("Score").select("positive");
			cy.findByLabelText("Strength").select("fresh");

			cy.findByText("Add habit").click();

			cy.findByText("Close dialog").click({force: true});
		});

		cy.findByText("Habit successfully addedd!");

		cy.findByText("Go to sleep at 9:30 AM");
	});

	it("Add habit form local storage sync", () => {
		cy.clearLocalStorage();

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("New habit").click();
		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").type("okokok");
			cy.findByLabelText("Score").select("negative");
			cy.findByLabelText("Strength").select("fresh");
			cy.findByLabelText("Track this habit").click();
			cy.findByLabelText("Description").type("kokoko");

			cy.findByText("Close dialog").click({force: true});
		});

		// The form values survive closing the modal
		cy.findByText("New habit").click();
		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").should("have.value", "okokok");
			cy.findByLabelText("Score").should("have.value", "negative");
			cy.findByLabelText("Strength").should("have.value", "fresh");
			cy.findByLabelText("Track this habit").should("not.be.checked");
			cy.findByLabelText("Description").should("have.value", "kokoko");
		});

		cy.reload();

		// The form values survive page reloads
		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").should("have.value", "okokok");
			cy.findByLabelText("Score").should("have.value", "negative");
			cy.findByLabelText("Strength").should("have.value", "fresh");
			cy.findByLabelText("Track this habit").should("not.be.checked");
			cy.findByLabelText("Description").should("have.value", "kokoko");

			// Reset form clears the local storage and restores the defauls
			cy.findByText("Reset form").click();
			cy.findByLabelText("Habit name").should("be.empty");
			cy.findByLabelText("Score").should("have.value", "positive");
			cy.findByLabelText("Strength").should("have.value", "established");
			cy.findByLabelText("Track this habit").should("be.checked");
			cy.findByLabelText("Description").should("be.empty");

			cy.clearLocalStorage();
		});
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

		cy.findByText("New habit").click();

		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").type("Wake up at 7:30 AM");
			cy.findByLabelText("Score").select("positive");
			cy.findByText("Add habit").click();

			cy.findByText(errorMessage);
		});

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

		cy.findByText("It seems you haven't added any habits yet.");
		cy.findByText("Show filters").should("be.disabled");
		cy.findByText("New habit");
	});

	it("renders returned items", () => {
		const response = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "established",
				is_trackable: true,
			},
			{
				id: 2,
				name: "Go to sleep",
				score: "neutral",
				strength: "fresh",
				is_trackable: true,
			},
			{
				id: 3,
				name: "Wake up",
				score: "negative",
				strength: "developing",
				is_trackable: true,
			},
			{
				id: 4,
				name: "Untrackable",
				score: "positive",
				strength: "established",
				is_trackable: false,
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
				cy.findAllByText(item.score);
			});
		});

		cy.findByText("Untracked");

		cy.findByText("Show filters").click();

		cy.findByLabelText("Positive (2)").should("not.be.checked");
		cy.findByLabelText("Neutral (1)").should("not.be.checked");
		cy.findByLabelText("Negative (1)").should("not.be.checked");
		cy.findByLabelText("Established (2)").should("not.be.checked");
		cy.findByLabelText("Fresh (1)").should("not.be.checked");
		cy.findByLabelText("Developing (1)").should("not.be.checked");
		cy.findByLabelText("All scores (4)").should("be.checked");
		cy.findByLabelText("All strengths (4)").should("be.checked");
		cy.findByTestId("number-of-habit-search-results").should("have.text", "4 results");

		cy.findByLabelText("Positive (2)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 2));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "2 results");

		cy.findByLabelText("Neutral (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "1 results");

		cy.findByLabelText("Negative (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "1 results");

		cy.findByLabelText("All scores (4)").check();

		cy.findByLabelText("Established (2)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 2));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "2 results");

		cy.findByLabelText("Developing (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "1 results");

		cy.findByLabelText("Fresh (1)").check();
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "1 results");

		cy.findByLabelText("All strengths (4)").check();

		cy.findByPlaceholderText("Search for habits...")
			.should("be.empty")
			.type("the");
		cy.get("ul").within(() => cy.get("li").should("have.length", 1));
		cy.findByTestId("number-of-habit-search-results").should("have.text", "1 results");

		cy.findByText("Clear").click();
		cy.findByPlaceholderText("Search for habits...").should("be.empty");
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
		cy.findByText("It seems you haven't added any habits yet.").should("not.exist");

		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: [],
		});

		cy.findByText("Retry").click();

		cy.findByText(errorMessage).should("not.exist");
		cy.findByText("Retry").should("not.exist");
		cy.findByText("It seems you haven't added any habits yet.");
	});

	it("deleting items", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem");

		cy.findAllByText("More")
			.first()
			.click();
		cy.findByText("Delete").click();

		cy.findByText("Nevermind, don't delete").click();
		cy.findByText("Close dialog").click({force: true});
		cy.findByText("0 lorem");

		cy.findByText("Show filters").click();

		cy.findByText("Positive (4)");
		cy.findByText("Neutral (3)");
		cy.findByText("Negative (3)");
		cy.findByText("All scores (10)");

		cy.findAllByText("More")
			.first()
			.click();
		cy.findByText("Delete").click();
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

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByText("Delete").click();
		cy.findByText("Yes, delete").click();

		cy.findByText("0 lorem").should("exist");
		cy.findByText(errorMessage);
	});

	it("inspecting habit details in modal", () => {
		const habitsResponse = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "fresh",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				progress_streak: 2,
				regress_streak: 0,
				is_trackable: true,
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
				is_trackable: true,
			},
		];

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: habitsResponse,
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit/1",
			status: 200,
			response: habitsResponse[0],
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
			url: "/api/v1/habit-chart/1?habitVoteChartDateRange=last_week",
			status: 200,
			response: chartResponse,
		});

		cy.route({
			method: "GET",
			url: "/api/v1/habit/2",
			status: 200,
			response: habitsResponse[1],
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit-chart/2?habitVoteChartDateRange=last_week",
			status: 500,
			response: [],
		});

		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=1",
			status: 200,
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
			cy.findByText("2019-01-01 00:00");
			cy.findByText("2019-02-01 00:00");
			cy.findByText("2 days progress streak");
			cy.findByDisplayValue("Last week");
			for (const {day, vote} of chartResponse) {
				cy.findByTitle(`${day} - ${vote}`);
			}
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByText("More")
			.eq(1)
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral");
			cy.findByDisplayValue("developing");
			cy.findByDisplayValue("Go to sleep");
			cy.findByText("2019-01-01 00:00");
			cy.findByText("2019-02-01 00:00");
			cy.findByText("1 day regress streak");
			cy.findByDisplayValue("Last week");
			cy.findByText("Charts unavailable, please try again.");
		});

		cy.findByText("Fetching chart data failed.");
	});

	it("inspecting untracked habit in dialog", () => {
		const response = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "fresh",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				is_trackable: false,
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

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("Untracked");

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByText("Habit preview");
			cy.findByDisplayValue("positive");
			cy.findByDisplayValue("fresh");
			cy.findByDisplayValue("Watch The Office");

			cy.findByText("Untracked");
			cy.findByPlaceholderText("Write something...");

			cy.findByText("Created at:");
			cy.findByText("2019-01-01 00:00");

			cy.findByText("Last updated at:");
			cy.findByText("2019-02-01 00:00");

			cy.findByText("Select date range:").should("not.exist");
			cy.findByText("Vote comments").should("not.exist");
		});
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
		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

		cy.findByText("0 lorem xxx");
		cy.findByText("0 lorem").should("not.exist");

		// Enter flow
		cy.findByText("1 loremlorem yyy").should("not.exist");
		cy.findAllByText("More")
			.eq(1)
			.click();

		cy.findByDisplayValue("1 loremlorem").type(" yyy{enter}");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Cancel").should("not.exist");
		cy.findAllByText("Name updated successfully!");
		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

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

		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

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
			cy.wait(100);
			cy.findByText("Close dialog").click({force: true});
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
			cy.wait(100);
			cy.findByText("Close dialog").click({force: true});
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

	// The reason for skipping this test is that I cannot make it pass consistently.
	// Sometimes the resulting order looks like this: 1230456789 instead of 1203456789.
	// The good thing is that `reordering habits (keyboard)` test coverrs the same
	// functionality, just via keyboard.
	// It seems ok to do so, Atlassion does the same thing most of the times.
	//
	// [source](https://github.com/atlassian/react-beautiful-dnd/blob/master/cypress/integration/reorder-lists.spec.js)
	//
	// INFO: Consider refactoring if there's a reliable drad and drop cypress solution.
	it.skip("reordering habits (mouse)", () => {
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

		cy.findByText("Habits reordered successfully!");

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

		cy.reload().wait(5000);

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
			cy.wait(100);
			cy.findByText("Close dialog").click({force: true});
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

	it("comments history request error", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=6",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByText("Vote comments");
		cy.findAllByText("Couldn't fetch vote comments.");
	});

	it("comments history empty list", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=6",
			status: 200,
			response: [],
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByText("Vote comments");
		cy.findByText("Future vote comments will appear here.");
	});

	it("comments history list", () => {
		cy.login("pam");
		cy.visit(HABITS_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=36",
			status: 200,
			response: [
				{
					id: 35,
					vote: "regress",
					day: "2020-01-19T00:00:00.000Z",
					comment: "123",
					habit_id: 36,
				},
				{
					id: 34,
					vote: "plateau",
					day: "2020-01-18T00:00:00.000Z",
					comment: "124",
					habit_id: 36,
				},
				{
					id: 33,
					vote: "progress",
					day: "2020-01-17T00:00:00.000Z",
					comment: "125",
					habit_id: 36,
				},
			],
		});

		cy.findAllByText("More")
			.eq(5)
			.click();

		cy.findByText("Vote comments");

		cy.findByText("2020-01-19 (Sun)");
		cy.findByDisplayValue("123").should("be.disabled");

		cy.findByText("2020-01-18 (Sat)");
		cy.findByDisplayValue("124").should("be.disabled");

		cy.findByText("2020-01-17 (Fri)");
		cy.findByDisplayValue("125").should("be.disabled");

		cy.findByText("regress").click();

		cy.url().should("contain", "/calendar?preview_day=2020-01-19&highlighted_habit_id=36");
	});
});
