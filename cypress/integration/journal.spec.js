/* eslint-disable sonarjs/no-identical-functions */

const DASHBOARD_URL = "/dashboard";

describe("Journal", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);
	});

	it("journal textarea is available in a day dialog", () => {
		cy.findByText("View today").click();

		cy.findByRole("dialog").within(() => {
			cy.findAllByText("Journal")
				.first()
				.click({force: true});
			cy.findAllByLabelText("Journal");
		});
	});

	it("updating existing journal with a non-empty content", () => {
		cy.findByText("View today").click();

		cy.findAllByText("Journal")
			.first()
			.click({force: true});

		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "10 lorem ipsumlorem ipsum")
			.type(" xd");
		cy.findByText("Save").click();

		cy.findByText("Daily journal successfully updated!");

		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "10 lorem ipsumlorem ipsum xd");

		cy.reload();

		cy.findAllByText("Journal")
			.first()
			.click({force: true});

		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "10 lorem ipsumlorem ipsum xd");
	});

	it("should trigger a prompt when closing the dialog with unsaved changes", () => {
		cy.findByText("View today").click();

		cy.findAllByText("Journal")
			.first()
			.click({force: true});

		cy.findAllByLabelText("Journal")
			.first()
			.type(" mood: ehhh");

		cy.findByText("Close dialog").click({force: true});

		cy.on("window:confirm", text =>
			expect(text).to.eq("Are you sure? You will lose the changes to your journal."),
		);
	});
});
