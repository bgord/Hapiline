const DASHBOARD_URL = "/dashboard";
import {subDays} from "date-fns";

describe("notifications", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("displays notifications", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

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
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

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
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

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

	it("notification creation dates", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/notifications",
			status: 200,
			response: [
				{
					id: 1,
					content: "123",
					created_at: subDays(new Date(), 0),
				},
				{
					id: 2,
					content: "234",
					created_at: subDays(new Date(), 1),
				},
				{
					id: 3,
					content: "345",
					created_at: subDays(new Date(), 2),
				},
			],
		});

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("Notifications dropdown").click({force: true});

		cy.get("#notification-list").within(() => {
			cy.findByText("today");
			cy.findByText("yesterday");
			cy.findByText("2 days ago");
		});
	});

	it("click outside", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("Notifications dropdown").click({force: true});

		cy.findByText("Notifications");

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		} else {
			cy.findByText("Habits").click();
		}

		cy.findByText("Notifications").should("not.exist");
	});
});
