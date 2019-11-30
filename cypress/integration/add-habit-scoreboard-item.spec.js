const DASHBOARD_URL = "/dashboard";

describe("Add habit scoreboard item", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("basic flow", () => {
		cy.login("dwight");

		cy.visit(DASHBOARD_URL);
		cy.findByText("xxx");
	});
});
