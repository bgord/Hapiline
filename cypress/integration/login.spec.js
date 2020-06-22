const admin = {
	email: "admin@example.com",
	password: "123456",
	invalidPassword: "654321",
};

const DASHBOARD_URL = "/dashboard";
const HOME_URL = "/";
const LOGIN_URL = "/login";
const REGISTRATION_URL = "/register";
const FORGOT_PASSWORD_URL = "/forgot-password";

describe("Login", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("goes through the basic login/logout flow", () => {
		cy.visit(HOME_URL);

		cy.findByText("Login").click();
		cy.url().should("include", LOGIN_URL);

		cy.findByLabelText("Email").type(admin.email);
		cy.findByLabelText("Password").type(admin.password);
		cy.findByTestId("login-submit").click();

		cy.url().should("include", DASHBOARD_URL);

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		}
		cy.findByText("Logout").click({force: true});

		cy.url().should("include", HOME_URL);
	});

	it("has links to registration and forgot password pages", () => {
		cy.visit(LOGIN_URL);
		cy.findByText("Don't have an account?");
		cy.findByText("Create now").click();
		cy.url().should("contain", REGISTRATION_URL);

		cy.visit(LOGIN_URL);
		cy.findByText("Forgot password?").click();
		cy.url().should("contain", FORGOT_PASSWORD_URL);
	});

	it("displays server side errors", () => {
		cy.visit(LOGIN_URL);

		cy.findByLabelText("Email").type(admin.email);
		cy.findByLabelText("Password").type(admin.invalidPassword);
		cy.findByTestId("login-submit").click();

		cy.findByText("Invalid email or password.");

		cy.url().should("contain", "/login");
	});

	it("client-side validation errors", () => {
		cy.visit(LOGIN_URL);

		cy.findByLabelText("Email")
			.type("admin")
			.should("not.be.valid");
		cy.findByLabelText("Password")
			.type("123")
			.should("not.be.valid");
		cy.findByTestId("login-submit").click();

		cy.findByText("Invalid email or password.").should("not.exist");

		cy.url().should("contain", LOGIN_URL);
	});

	it("doesn't let unlogged users access /dashboard and /logout", () => {
		cy.visit(DASHBOARD_URL);
		cy.url().should("include", HOME_URL);

		cy.visit("/logout");
		cy.url().should("include", HOME_URL);
	});

	it("doesn't let logged users access /login and /", () => {
		cy.visit(LOGIN_URL);

		cy.findByLabelText("Email").type(admin.email);
		cy.findByLabelText("Password").type(admin.password);
		cy.findByTestId("login-submit").click();

		cy.visit("/login");
		cy.url().should("include", DASHBOARD_URL);

		cy.visit("/");
		cy.url().should("include", DASHBOARD_URL);
	});

	it("nested invalid route redirecting for unlogged user", () => {
		cy.visit("/login/x/x/x");
		cy.url().should("include", HOME_URL);

		cy.visit("/login/x/x/x/");
		cy.url().should("include", HOME_URL);

		cy.visit("/dashboard/x/x/x");
		cy.url().should("include", HOME_URL);

		cy.visit("/dashboard/x/x/x/");
		cy.url().should("include", HOME_URL);

		cy.visit("/xxx");
		cy.url().should("include", HOME_URL);
	});

	it("nested invalid route redirecting for logged user", () => {
		cy.visit("/login");

		cy.findByLabelText("Email").type(admin.email);
		cy.findByLabelText("Password").type(admin.password);
		cy.findByTestId("login-submit").click();

		cy.visit("/login/x/x/x");
		cy.url().should("include", DASHBOARD_URL);

		cy.visit("/login/x/x/x/");
		cy.url().should("include", DASHBOARD_URL);

		cy.visit("/dashboard/x/x/x");
		cy.url().should("include", DASHBOARD_URL);

		cy.visit("/dashboard/x/x/x/");
		cy.url().should("include", DASHBOARD_URL);

		cy.visit("/xxx");
		cy.url().should("include", DASHBOARD_URL);
	});

	it("500", () => {
		const errorMessage = "Login failed, try again later";

		cy.server();
		cy.route({
			method: "POST",
			url: "/api/v1/login",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.visit(LOGIN_URL);

		cy.findByLabelText("Email").type(admin.email);
		cy.findByLabelText("Password").type(admin.password);
		cy.findByTestId("login-submit").click();

		cy.findByText(errorMessage);
	});
});
