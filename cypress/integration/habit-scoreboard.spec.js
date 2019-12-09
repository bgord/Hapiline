const DASHBOARD_URL = "/dashboard";

describe("Habit scoreboard", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("Add an item", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByLabelText("Habit").type("Wake up at 7:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByText("Add habit").click();

		cy.findByText("Habit successfully addedd!");

		cy.findByText("x").click();
		cy.findByText("Habit successfully addedd!").should("not.exist");

		cy.findByLabelText("Habit").should("have.value", "");
		cy.findByLabelText("Score").should("have.value", "neutral");

		cy.findByLabelText("Habit").type("Wake up at 7:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByText("Add habit").click();
		cy.findByText("Given habit already exists.");

		cy.findByLabelText("Habit")
			.clear()
			.type("Go to sleep at 9:30 AM");
		cy.findByLabelText("Score").select("positive");
		cy.findByText("Add habit").click();
		cy.findByText("Habit successfully addedd!");
		cy.findByText("x").click();

		cy.findByDisplayValue("Go to sleep at 9:30 AM");
	});

	it("500 while adding an item", () => {
		const errorMessage = "Unexpected error, try again later.";
		cy.server();
		cy.route({
			method: "POST",
			url: "/api/v1/habit-scoreboard-item",
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
	});

	it("empty list of items", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habit-scoreboard-items",
			status: 200,
			response: [],
		});

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("Seems you haven't added any habits yet.");
	});

	it("renders returned items", () => {
		const response = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
			},
			{
				id: 2,
				name: "Go to sleep",
				score: "neutral",
			},
			{
				id: 3,
				name: "Wake up",
				score: "negative",
			},
		];

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habit-scoreboard-items",
			status: 200,
			response,
		});

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		response.forEach(item => {
			cy.findByDisplayValue(item.name);
			cy.findByText(item.score);
		});
	});

	it("error while getting items", () => {
		const errorMessage = "Error while getting the list.";

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habit-scoreboard-items",
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
	});

	it("deleting items", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByDisplayValue("0 lorem");

		cy.findAllByText("Delete")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").should("not.exist");
	});

	it("changing name", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		// "Save" flow
		cy.findByDisplayValue("0 lorem xxx").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Save").click();

		cy.findByDisplayValue("0 lorem xxx");

		cy.findByDisplayValue("0 lorem").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");

		// Enter flow
		cy.findByDisplayValue("1 loremlorem yyy").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");

		cy.findByDisplayValue("1 loremlorem").type(" yyy{enter}");

		cy.findByDisplayValue("1 loremlorem yyy");

		cy.findByDisplayValue("1 loremlorem").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");
	});

	it("clicking through the inputs", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByDisplayValue("0 lorem")
			.click()
			.type(" xxx");

		cy.findByDisplayValue("0 lorem xxx");

		cy.findByDisplayValue("1 loremlorem").click();
		cy.findByDisplayValue("0 lorem xxx").should("not.exist");
	});
});
