/* eslint-disable sonarjs/no-identical-functions */

const PROFILE_URL = "/profile";

describe("Profile", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("works", () => {
		cy.login("dwight");
		cy.visit(PROFILE_URL);

		cy.findByText("Profile");
	});
});
