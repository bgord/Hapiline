const LOGIN_URL = "/login";
const REGISTRATION_URL = "/register";

const validNewCredentials = {
	email: "new-user@example.com",
	password: "123456",
};

describe("Registration", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");

		cy.request({
			method: "DELETE",
			url: Cypress.env("MAILHOG_API_URL"),
			auth: {
				username: Cypress.env("MAILHOG_USERNAME"),
				password: Cypress.env("MAILHOG_PASSWORD"),
			},
		});
	});

	it("full flow", () => {
		cy.visit(REGISTRATION_URL);

		cy.findByLabelText("Email").type(validNewCredentials.email);
		cy.findByLabelText("Password").type(validNewCredentials.password);
		cy.findByLabelText("Repeat password").type(validNewCredentials.password);
		cy.findByTestId("registration-submit").click();

		cy.findByText("Account confirmation email has been sent!");
		cy.findByText("You can");
		cy.findByText("login now");

		cy.findByLabelText("Email").should("be.disabled");
		cy.findByLabelText("Password").should("be.disabled");
		cy.findByLabelText("Repeat password").should("be.disabled");

		cy.findByText("login now").click();
		cy.url().should(
			"contain",
			`${LOGIN_URL}?registrationEmail=${validNewCredentials.email}`,
		);
		cy.findByLabelText("Email").should("have.value", validNewCredentials.email);
	});

	it("validation", () => {
		const invalidEmail = "xxx@";
		const takenEmail = "admin@example.com";
		const tooShortPassword = "xxx";
		const correctPassword = "123456";
		const incorrectPasswordConfirmation = "55555";

		cy.visit(REGISTRATION_URL);

		cy.findByLabelText("Email")
			.type(invalidEmail)
			.should("not.be.valid");

		cy.findByLabelText("Password")
			.type(tooShortPassword)
			.should("not.be.valid");

		cy.findByLabelText("Repeat password")
			.type(incorrectPasswordConfirmation)
			.should("not.be.valid");

		cy.findByLabelText("Email")
			.clear()
			.type(takenEmail);
		cy.findByLabelText("Password")
			.clear()
			.type(correctPassword);
		cy.findByLabelText("Repeat password")
			.clear()
			.type(correctPassword);

		cy.findByTestId("registration-submit").click();

		cy.findByText("Given email address already exists.");
	});

	it("500", () => {
		const errorMessage = "Unexpected error, please try again.";

		cy.server();
		cy.route({
			method: "POST",
			url: "/api/v1/register",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.visit(REGISTRATION_URL);

		cy.findByLabelText("Email").type(validNewCredentials.email);
		cy.findByLabelText("Password").type(validNewCredentials.password);
		cy.findByLabelText("Repeat password").type(validNewCredentials.password);
		cy.findByTestId("registration-submit").click();

		cy.findByText(errorMessage);
	});
});
