const DASHBOARD_URL = "/dashboard";

describe("Add habit scoreboard item", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("basic flow", () => {
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
	});
});
