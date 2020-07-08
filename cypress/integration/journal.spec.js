/* eslint-disable sonarjs/no-identical-functions */

import {format, subDays} from "date-fns";

const DASHBOARD_URL = "/dashboard";

const today = format(new Date(), "yyyy-MM-dd");
const dayFromPast = format(subDays(new Date(), 2), "yyyy-MM-dd");

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
			cy.findByText("Synced");
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
		cy.findByText("Unsaved changes");

		cy.findByText("Save").click();

		cy.findByText("Daily journal successfully updated!");

		cy.findByText("Synced");

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

	it("Update journal with empty value", () => {
		cy.visit(DASHBOARD_URL);

		cy.findByText("View today").click({force: true});
		cy.findAllByText("Journal")
			.first()
			.click({force: true});
		cy.findAllByLabelText("Journal")
			.first()
			.clear();
		cy.findByText("Save").click({force: true});
		cy.findByText("Daily journal successfully updated!");

		cy.findAllByText("Journal")
			.first()
			.click({force: true});
		cy.findAllByLabelText("Journal")
			.first()
			.should("have.value", "");
	});

	it("Save journal to wrong day", () => {
		cy.visit(DASHBOARD_URL);
		const DAY_FROM_PAST_URL = `/calendar?preview_day=${dayFromPast}&habit_vote_filter=all&tab=journal`;

		cy.visit(DAY_FROM_PAST_URL);
		cy.findAllByText("Journal")
			.first()
			.click({force: true});
		cy.findAllByLabelText("Journal")
			.first()
			.type("xd");
		cy.findByText("Save").click({force: true});
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
			.click({force: true});
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
			.click({force: true});
		cy.findAllByLabelText("Journal")
			.first()
			.type(" xd");
		cy.findByText("Save").click();
		cy.findByText("Couldn't save daily journal, please try again.");
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
