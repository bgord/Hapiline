const DASHBOARD_URL = "/dashboard";

describe("notifications", () => {
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

	// TODO: Write tests for request errors
});
