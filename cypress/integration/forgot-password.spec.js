const FORGOT_PASSWORD_URL = "/forgot-password";
const NEW_PASSWORD_URL = "/new-password";
const LOGIN_URL = "/login";
const DASHBOARD_URL = "/";

const existingUser = {
	email: "regular1@example.com",
	password: "123456",
};

describe("Forgot password", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
		cy.request("DELETE", "http://localhost:8025/api/v1/messages");
	});

	it("full flow", () => {
		const tooShortPassword = "xxx";
		const correctPassword = "prison_mike";
		const notMatchingPasswordConfirmation = "date_mike";

		cy.visit(FORGOT_PASSWORD_URL);
		cy.findByLabelText("Email").type(existingUser.email);
		cy.findByText("Send email").click();
		cy.findByText("Email sent if an account exists.");

		cy.request("http://localhost:8025/api/v1/messages").should(response => {
			const emailContent = response.body[0].Content.Body.split("\n");

			const firstLinkPart = emailContent[17].trim().replace(/=/, "");
			const secondLinkPart = emailContent[18].trim();

			const newPasswordLink = firstLinkPart + secondLinkPart;

			cy.visit(newPasswordLink);
			cy.url().should("contain", NEW_PASSWORD_URL);

			cy.findByLabelText("Password")
				.type(tooShortPassword)
				.should("not.be.valid")
				.clear()
				.type(correctPassword);

			cy.findByLabelText("Repeat password")
				.type(notMatchingPasswordConfirmation)
				.should("not.be.valid")
				.clear()
				.type(correctPassword);

			cy.findByText("Change password").click();
			cy.findByText("Password has been changed!");

			cy.visit(LOGIN_URL);

			cy.findByLabelText("Email").type(existingUser.email);
			cy.findByLabelText("Password").type(correctPassword);
			cy.findByTestId("login-submit").click();
			cy.url().should("contain", DASHBOARD_URL);
		});
	});

	it("displays the same message for non-existent email", () => {
		const nonExistentEmail = "michael_scott@example.com";

		cy.visit(FORGOT_PASSWORD_URL);
		cy.findByLabelText("Email").type(nonExistentEmail);
		cy.findByText("Send email").click();
		cy.findByText("Email sent if an account exists.");
	});
});
