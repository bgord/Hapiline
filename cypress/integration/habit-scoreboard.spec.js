const DASHBOARD_URL = "/dashboard";

describe("Habit scoreboard", () => {
	before(() => {
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
			.type("Go to sleep at 9:30PAM");
		cy.findByLabelText("Score").select("positive");
		cy.findByText("Add habit").click();
		cy.findByText("Habit successfully addedd!");
		cy.findByText("x").click();

		cy.findByText("Go to sleep at 9:30PAM");
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
			cy.findByText(item.name);
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
});
