const FORGOT_PASSWORD_URL = "/forgot-password";
const NEW_PASSWORD_URL = "/new-password";
const LOGIN_URL = "/login";
const DASHBOARD_URL = "/";

const existingUser = {
	email: "jim@example.com",
	password: "123456",
};

describe("Forgot password", () => {
	it.skip("full flow", () => {
		const tooShortPassword = "xxx";
		const correctPassword = "prison_mike";
		const notMatchingPasswordConfirmation = "date_mike";

		cy.visit(FORGOT_PASSWORD_URL);
		cy.findByLabelText("Email").type(existingUser.email);
		cy.findByText("Send email").click();
		cy.findByText("Email sent if an account exists.");

		cy.wait(1000);

		cy.request({
			method: "GET",
			url: Cypress.env("MAILHOG_API_URL"),
			auth: {
				username: Cypress.env("MAILHOG_USERNAME"),
				password: Cypress.env("MAILHOG_PASSWORD"),
			},
		}).should(response => {
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

	beforeEach(() => {
		cy.visit(FORGOT_PASSWORD_URL);

		cy.injectAxe();
	});

	it("displays the same message for non-existent email", () => {
		const nonExistentEmail = "michael_scott@example.com";

		cy.findByText("You will receive an email with further instructions.");
		cy.findByText("Email sent if an account exists.").should("not.exist");

		cy.findByLabelText("Email").type(nonExistentEmail);
		cy.findByText("Send email").click();

		cy.findByText("You will receive an email with further instructions.").should("not.exist");
		cy.findByText("Email sent if an account exists.");

		cy.checkA11y();
	});
});
