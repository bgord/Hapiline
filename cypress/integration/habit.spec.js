/* eslint-disable sonarjs/no-identical-functions */

const DASHBOARD_URL = "/dashboard";

describe("Habit", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("Add an item", () => {
		cy.clock();

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByLabelText("Habit").type("Wake up at 7:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByLabelText("Strength").select("fresh");

		cy.findByText("Add habit").click();
		cy.findByText("Habit successfully addedd!");

		cy.tick(10000);

		cy.findByText("Habit successfully addedd!").should("not.exist");

		cy.findByLabelText("Habit").should("have.value", "");
		cy.findByLabelText("Score").should("have.value", "neutral");
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
		cy.visit(DASHBOARD_URL);

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
		cy.visit(DASHBOARD_URL);

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
		cy.visit(DASHBOARD_URL);

		cy.get("ul").within(() => {
			response.forEach(item => {
				cy.findByText(item.name);
				cy.findByText(item.score);
			});
		});

		cy.findByText("positive: 1");
		cy.findByText("neutral: 1");
		cy.findByText("negative: 1");
		cy.findByText("established: 1");
		cy.findByText("fresh: 1");
		cy.findByText("developing: 1");
		cy.findByText("total: 3");
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
		cy.visit(DASHBOARD_URL);

		cy.findByText(errorMessage);
		cy.findByText("Couldn't fetch habit list.");
	});

	it("deleting items", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("0 lorem");
		cy.findAllByText("Delete")
			.first()
			.click();
		cy.findByText("Nevermind, don't delete").click();
		cy.findByText("0 lorem");

		cy.findByText("positive: 4");
		cy.findByText("neutral: 3");
		cy.findByText("negative: 3");
		cy.findByText("total: 10");

		cy.findAllByText("Delete")
			.first()
			.click();
		cy.findByText("Yes, delete").click();
		cy.findByText("0 lorem").should("not.exist");
		cy.findByText("Habit successfully deleted!");

		cy.findByText("positive: 3");
		cy.findByText("neutral: 3");
		cy.findByText("negative: 3");
		cy.findByText("total: 9");
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
		cy.visit(DASHBOARD_URL);

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
			},
			{
				id: 2,
				name: "Go to sleep",
				score: "neutral",
				strength: "developing",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
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
		cy.route({
			method: "GET",
			url: "/api/v1/habit/2",
			status: 200,
			response: response[1],
		});

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findAllByText("more")
			.first()
			.click();

		cy.get(".h-full").within(() => {
			cy.findByDisplayValue("positive");
			cy.findByDisplayValue("fresh");
			cy.findByDisplayValue("Watch The Office");
			cy.findByText("2019/01/01 00:00");
			cy.findByText("2019/02/01 00:00");
			cy.findByText("×").click();
		});

		cy.findAllByText("more")
			.eq(1)
			.click();

		cy.get(".h-full").within(() => {
			cy.findByDisplayValue("neutral");
			cy.findByDisplayValue("developing");
			cy.findByDisplayValue("Go to sleep");
			cy.findByText("2019/01/01 00:00");
			cy.findByText("2019/02/01 00:00");
			cy.findByText("×").click();
		});
	});

	it("changing name", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		// "Save" flow
		cy.findByText("0 lorem xxx").should("not.exist");
		cy.findAllByText("more")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Cancel");
		cy.findByText("Save").click();
		cy.findByText("Name updated successfully!");
		cy.findByText("×").click();

		cy.findByText("0 lorem xxx");
		cy.findByText("0 lorem").should("not.exist");

		// // Enter flow
		cy.findByText("1 loremlorem yyy").should("not.exist");
		cy.findAllByText("more")
			.eq(1)
			.click();

		cy.findByDisplayValue("1 loremlorem").type(" yyy{enter}");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Cancel").should("not.exist");
		cy.findAllByText("Name updated successfully!");
		cy.findByText("×").click();

		cy.findByText("1 loremlorem yyy");
		cy.findByText("1 loremlorem").should("not.exist");
	});

	it("cancel changing name", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findAllByText("more")
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
		cy.visit(DASHBOARD_URL);

		cy.findByText("0 lorem xxx").should("not.exist");
		cy.findAllByText("more")
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
		cy.visit(DASHBOARD_URL);

		cy.findAllByText("more")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Save").click();
		cy.findByText("Save");
		cy.findByText("Cancel");
		cy.findByText(errorMessage);

		cy.findByText("×").click();

		cy.findByDisplayValue("0 lorem xxx").should("not.exist");
	});

	it("changing scores", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("more")
				.eq(1)
				.click();
		});

		cy.get(".h-full").within(() => {
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
		cy.visit(DASHBOARD_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("more")
				.eq(1)
				.click();
		});

		cy.get(".h-full").within(() => {
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
		cy.visit(DASHBOARD_URL);

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
		cy.visit(DASHBOARD_URL);

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
		cy.visit(DASHBOARD_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("established").should("have.length", 4);
			cy.findAllByText("fresh").should("have.length", 3);
			cy.findAllByText("developing").should("have.length", 3);

			cy.findAllByText("more")
				.eq(1)
				.click();
		});

		cy.findByDisplayValue("developing").select("established");
		cy.findAllByText("Habit strength changed successfully!");
		cy.findByText("×").click();

		cy.get("ul").within(() => {
			cy.findAllByText("established").should("have.length", 5);
			cy.findAllByText("fresh").should("have.length", 3);
			cy.findAllByText("developing").should("have.length", 2);
		});
	});
});
