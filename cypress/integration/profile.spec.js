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

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		}
		cy.findByText("dwight@example.com").click();

		cy.url().should("contain", PROFILE_URL);

		cy.findByText("Profile settings");
		cy.findByText(
			"Your data will be removed pernamently, and you won't be able to recover your account.",
		);
		cy.findByText("Created at:");

		cy.findByText("Delete account").click();
		cy.findByText("Nevermind, don't delete").click();

		cy.findByText("Delete account").click();
		cy.findByText("Yes, delete").click();

		cy.url().should("contain", LOGIN_URL);

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
		cy.clock();
		cy.login("dwight");
		cy.visit(PROFILE_URL);

		cy.findByLabelText("New email").should("be.empty");
		cy.findByLabelText("Password").should("be.empty");
		cy.findByText("You will have to confirm your new email adress and login back again.");
		cy.findByText("Confirm email").should("be.disabled");

		cy.findByLabelText("New email")
			.clear()
			.type("dwight@dundermifflin.com");
		cy.findByLabelText("Password").type("123456");
		cy.findByText("Confirm email").click();

		cy.findByText("Email confirmation message has been sent! You will be logged out in 5 seconds.");

		cy.tick(5000);
		cy.url().should("contain", LOGIN_URL);
	});

	it("email confirmation errors", () => {
		cy.clock();

		cy.login("michael");
		cy.visit(PROFILE_URL);

		// Invalid password
		cy.findByLabelText("New email")
			.clear()
			.type("michael@dundermifflin.com");
		cy.findByLabelText("Password")
			.clear()
			.type("chocolate_cake");
		cy.findByText("Confirm email").click();

		cy.findByText("Couldn't change email.");
		cy.findByText("Invalid password.");

		cy.tick(10000);

		// Already existing email
		cy.findByLabelText("New email")
			.clear()
			.type("jim@example.com");
		cy.findByLabelText("Password")
			.clear()
			.type("123456");
		cy.findByText("Confirm email").click();

		cy.findByText("Couldn't change email.");
		cy.findByText("Given email address already exists.");
	});

	it("password change", () => {
		cy.clock();

		cy.login("dwight");
		cy.visit(PROFILE_URL);

		// Happy path
		cy.findByLabelText("Old password").type("123456");
		cy.findByLabelText("New password").type("nonono");
		cy.findByLabelText("Repeat new password").type("nonono");
		cy.findByText("Update password").click();

		cy.findByText("Password changed successfully!");

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		}
		cy.findByText("Logout").click();

		cy.url().should("contain", LOGIN_URL);

		cy.findByLabelText("Email").type("dwight@example.com");
		cy.findByLabelText("Password").type("nonono");
		cy.findByTestId("login-submit").click();

		cy.url().should("include", DASHBOARD_URL);
	});

	it("password change errors", () => {
		cy.clock();

		cy.login("dwight");
		cy.visit(PROFILE_URL);

		// Old password and new password are equal
		cy.findByLabelText("Old password").type("123456");
		cy.findByLabelText("New password").type("123456");
		cy.findByLabelText("Repeat new password").type("123456");
		cy.findByText("Update password").click();

		cy.findByText("Couldn't update password.");
		cy.findByText("Old password cannot be the same as the new password.");

		cy.tick(10000);

		// Old password is invalid
		cy.findByLabelText("Old password")
			.clear()
			.type("nonono");
		cy.findByLabelText("New password")
			.clear()
			.type("nowyno");
		cy.findByLabelText("Repeat new password")
			.clear()
			.type("nowyno");
		cy.findByText("Update password").click();

		cy.findByText("Couldn't update password.");
		cy.findByText("Invalid password");

		cy.tick(10000);

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/update-password",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
			},
		});

		// A random 500
		cy.findByLabelText("Old password")
			.clear()
			.type("123456");
		cy.findByLabelText("New password")
			.clear()
			.type("nowyno");
		cy.findByLabelText("Repeat new password")
			.clear()
			.type("nowyno");
		cy.findByText("Update password").click();

		cy.findByText("Couldn't update password.");
		cy.findByText("An unexpected error happened, please try again.");
	});
});
