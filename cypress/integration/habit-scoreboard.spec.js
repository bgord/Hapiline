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
		cy.findByText("Add habit").click();

		cy.findByText("Habit successfully addedd!");

		cy.tick(10000);

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

		cy.findByDisplayValue("Go to sleep at 9:30 AM");
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
			url: "/api/v1/habits",
			status: 200,
			response,
		});

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		response.forEach(item => {
			cy.findByDisplayValue(item.name);
			cy.findByDisplayValue(item.score);
		});
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

		cy.findByDisplayValue("0 lorem");

		cy.findAllByText("Delete")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").should("not.exist");
		cy.findByText("Habit successfully deleted!");
	});

	it("deleting items error", () => {
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

		cy.findByDisplayValue("0 lorem");

		cy.findAllByText("Delete")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").should("exist");
		cy.findByText(errorMessage);
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
		cy.findByText("Name updated successfully!");

		cy.findByDisplayValue("0 lorem xxx");

		cy.findByDisplayValue("0 lorem").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");

		// Enter flow
		cy.findByDisplayValue("1 loremlorem yyy").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");

		cy.findByDisplayValue("1 loremlorem").type(" yyy{enter}");
		cy.findAllByText("Name updated successfully!");

		cy.findByDisplayValue("1 loremlorem yyy");

		cy.findByDisplayValue("1 loremlorem").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");
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

		// "Save" flow
		cy.findByDisplayValue("0 lorem xxx").should("not.exist");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Reset").should("not.exist");

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Save").click();
		cy.findByText(errorMessage);

		cy.findByDisplayValue("0 lorem xxx");
		cy.findByText("Save");
		cy.findByText("Reset");
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

	it("changing score names", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.get("ul").within(() => {
			cy.findAllByDisplayValue("positive").should("have.length", 4);
			cy.findAllByDisplayValue("neutral").should("have.length", 3);
			cy.findAllByDisplayValue("negative").should("have.length", 3);

			cy.findAllByDisplayValue("neutral")
				.first()
				.select("positive");

			cy.findAllByDisplayValue("positive").should("have.length", 5);
			cy.findAllByDisplayValue("neutral").should("have.length", 2);
			cy.findAllByDisplayValue("negative").should("have.length", 3);
		});
	});

	it("changing score names error", () => {
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
			cy.findAllByDisplayValue("positive").should("have.length", 4);
			cy.findAllByDisplayValue("neutral").should("have.length", 3);
			cy.findAllByDisplayValue("negative").should("have.length", 3);

			cy.findAllByDisplayValue("neutral")
				.first()
				.select("positive");

			cy.findAllByDisplayValue("positive").should("have.length", 4);
			cy.findAllByDisplayValue("neutral").should("have.length", 3);
			cy.findAllByDisplayValue("negative").should("have.length", 3);
		});
	});
});
