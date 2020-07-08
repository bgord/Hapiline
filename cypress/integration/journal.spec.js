/* eslint-disable sonarjs/no-identical-functions */

const DASHBOARD_URL = "/dashboard";
import {format, addDays} from "date-fns";
const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = addDays(new Date(), 1);
const domain = "http://hapiline.localhost";

describe("Journal", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
		cy.login("dwight");
	});

	it("Update journal", () => {
		cy.visit(DASHBOARD_URL);

		cy.findByText("View today").click();
		cy.findAllByText("Journal")
			.first()
			.click();
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
			.click();
		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "10 lorem ipsumlorem ipsum xd");
	});

	it("Update journal with empty value", () => {
		cy.visit(DASHBOARD_URL);

		cy.findByText("View today").click();
		cy.findAllByText("Journal")
			.first()
			.click();
		cy.findAllByLabelText("Journal")
			.first()
			.clear();
		cy.findByText("Save").click();
		cy.findByText("Daily journal successfully updated!");

		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "");
		cy.reload();
		cy.findAllByText("Journal")
			.first()
			.click();
		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "");
	});

	it("Save journal to wrong day", () => {
		cy.visit(DASHBOARD_URL);
		//${tomorrow}
		const URL = `${domain}/calendar?preview_day=2020-07-07&habit_vote_filter=all&tab=journal`;
		cy.visit(URL);
		cy.findAllByText("Journal")
			.first()
			.click();
		cy.findAllByLabelText("Journal")
			.first()
			.type("xd");
		cy.findByText("Save").click();
		cy.findByText("Error while updating daily jorunal");
	});

	it("Error while loading daily journal", () => {
		cy.visit(DASHBOARD_URL);
		const errorMessage = "Error while loading daily journal.";
		cy.server();
		cy.route({
			method: "GET",
			url: `/api/v1/journal?day=${today}`,
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.findByText("View today").click();
		cy.findAllByText("Journal")
			.first()
			.click();
		cy.findByText("Error while loading daily jorunal.");
	});

	it("Error while updating journal", () => {
		cy.visit(DASHBOARD_URL);
		const errorMessage = "Error while updating daily journal";

		cy.server();
		cy.route({
			method: "POST",
			url: `/api/v1/journal`,
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});
		cy.findByText("View today").click();
		cy.findAllByText("Journal")
			.first()
			.click();
		cy.findAllByLabelText("Journal")
			.first()
			.type(" xd");
		cy.findByText("Save").click();
		cy.findByText("Couldn't save daily journal, please try again.");
	});
});
