const LOGIN_URL = "/login";
const REGISTRATION_URL = "/register";
const DASHBOARD_URL = "/dashboard";
const EMAIL_VERIFICATION_URL = "/verify-email";
const HOME_URL = "/";

const validNewCredentials = {
	email: "new-user@example.com",
	password: "123456",
};

describe("Registration", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
		cy.request("DELETE", "http://localhost:8025/api/v1/messages");
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
		cy.url().should("contain", LOGIN_URL);

		cy.request("http://localhost:8025/api/v1/messages").should(response => {
			const emailContent = response.body[0].Content.Body.split("\n");

			const firstLinkPart = emailContent[17].trim().replace(/=/, "");
			const secondLinkPart = emailContent[18].trim();

			const emailVerificationLink = firstLinkPart + secondLinkPart;

			cy.visit(emailVerificationLink);
			cy.url().should("contain", EMAIL_VERIFICATION_URL);

			cy.findByText("Verifying...");

			cy.findByText("login").click();
			cy.url().should("contain", LOGIN_URL);

			cy.findByLabelText("Email").type(validNewCredentials.email);
			cy.findByLabelText("Password").type(validNewCredentials.password);
			cy.findByTestId("login-submit").click();
			cy.url().should("contain", DASHBOARD_URL);

			cy.findByText("Logout").click();
			cy.url().should("contain", HOME_URL);

			cy.visit(emailVerificationLink);
			cy.url().should("contain", EMAIL_VERIFICATION_URL);

			cy.findByText("Invalid or expired token.");
		});
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
