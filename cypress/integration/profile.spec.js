/* eslint-disable sonarjs/no-identical-functions */

const PROFILE_URL = "/profile";
const DASHBOARD_URL = "/dashboard";
const LOGIN_URL = "/login";

describe("Profile", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("account deletion", () => {
		cy.visit(LOGIN_URL);

		cy.findByLabelText("Email").type("dwight@example.com");
		cy.findByLabelText("Password").type("123456");
		cy.findByTestId("login-submit").click();
		cy.url().should("include", DASHBOARD_URL);

		cy.visit(PROFILE_URL);

		cy.findByText("Profile");
		cy.findByText("Delete account").click();
		cy.findByText("Nevermind, don't delete").click();

		cy.findByText("Delete account").click();
		cy.findByText("Yes, delete").click();

		cy.url().should("contain", "/");
		cy.findByText("Welcome to home page");

		cy.findByText("Login").click();
		cy.findByLabelText("Email").type("dwight@example.com");
		cy.findByLabelText("Password").type("123456");
		cy.findByTestId("login-submit").click();

		cy.findByText("Access denied.");
	});

	it("account deletion error", () => {
		cy.login("dwight");
		cy.visit(PROFILE_URL);

		cy.server();
		cy.route({
			method: "DELETE",
			url: "/api/v1/account",
			status: 500,
			response: {},
		});

		cy.findByText("Delete account").click();
		cy.findByText("Yes, delete").click();

		cy.findByText("An error occurred during account deletion.");
		cy.findByText("Couldn't delete account.");
	});

	it("email confirmation success flow", () => {
		cy.login("dwight");
		cy.visit(PROFILE_URL);

		cy.findByLabelText("Email")
			.should("have.value", "dwight@example.com")
			.should("be.disabled");
		cy.findByText("Edit email");
		cy.findByText("Confirm email").should("not.exist");
		cy.findByText("Cancel").should("not.exist");
		cy.findByLabelText("Password").should("not.exist");

		cy.findByText("Edit email").click();

		cy.findByLabelText("Email")
			.should("have.value", "dwight@example.com")
			.should("not.be.disabled");
		cy.findByText("Edit email").should("not.exist");
		cy.findByText("Confirm email").should("be.disabled");
		cy.findByText("Cancel");
		cy.findByLabelText("Password").should("be.empty");

		cy.findByLabelText("Email")
			.clear()
			.type("xxx");
		cy.findByLabelText("Password").type("nonono");
		cy.findByText("Cancel").click();

		cy.findByLabelText("Email")
			.should("have.value", "dwight@example.com")
			.should("be.disabled");
		cy.findByText("Edit email");
		cy.findByText("Confirm email").should("not.exist");
		cy.findByText("Cancel").should("not.exist");
		cy.findByLabelText("Password").should("not.exist");

		cy.findByText("Edit email").click();
		cy.findByLabelText("Email")
			.clear()
			.type("dwight@dundermifflin.com");
		cy.findByLabelText("Password").type("123456");
		cy.findByText("Confirm email").click();

		cy.findByText("Email confirmation message has been sent!");
	});

	it("email confirmation errors", () => {
		cy.login("dwight");
		cy.visit(PROFILE_URL);

		cy.findByText("Edit email").click();
		cy.findByLabelText("Email")
			.clear()
			.type("dwight@dundermifflin.com");
		cy.findByLabelText("Password").type("battlestar");
		cy.findByText("Confirm email").click();

		cy.findByText("Couldn't change email.");
		cy.findByText("Invalid password.");
	});
});
