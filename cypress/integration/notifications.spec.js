const DASHBOARD_URL = "/dashboard";

describe("notifications", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);
	});

	it("displays notifications", () => {
		cy.injectAxe();

		cy.findByText("Notifications dropdown").click({force: true});

		cy.get("#notification-list").within(() => {
			cy.findByText("Notifications");
			cy.findByText("1");

			cy.findByText("Read");
			cy.findByText("Unread");

			cy.findAllByText("Congratulations! You did something good.").should("have.length", 2);
			cy.findAllByText("today").should("have.length", 2);
			cy.findByText("Read").click();

			cy.findByText("Read").should("not.exist");
			cy.findAllByText("Unread").should("have.length", 2);

			cy.findByText("Notifications");
			cy.findByText("0");

			cy.checkA11y("html", {
				rules: {
					// Disabled due to a slight issue with the notification date text color
					"color-contrast": {
						enabled: false,
					},
				},
			});

			cy.findByText("Close dialog").click({force: true});
		});

		cy.get("#notification-list").should("not.exist");
	});

	it("error while loading notifications", () => {
		const errorMessage = "Error while loading notifications";

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/notifications",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.findByText("Notifications dropdown").click({force: true});

		cy.get("#notification-list").within(() => {
			cy.findByText("Couldn't fetch notifications.");
		});
	});

	it("error while marking as read/unread", () => {
		const errorMessage = "Error while loading notifications";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/notification/3",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.findByText("Notifications dropdown").click({force: true});

		cy.get("#notification-list").within(() => {
			cy.findByText("Unread").click();
		});

		cy.findByText("Couldn't change notification status.");
	});
});
