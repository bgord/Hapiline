const JOURNALS_URL = "/journals";
import {format} from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");
const todayDayName = format(new Date(), "iiii");

describe("Journal list", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("empty list of items", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/journals",
			status: 200,
			response: [],
		});

		cy.login("dwight");
		cy.visit(JOURNALS_URL);

		cy.findByText("You don't have any journals yet.");
	});

	it("journal item leads to a journal day tab", () => {
		const journalUrl = `/calendar?preview_day=${today}&tab=journal&month_offset=0`;

		cy.login("dwight");
		cy.visit(JOURNALS_URL);

		cy.injectAxe();

		cy.findAllByText("Journals");

		cy.findByText(today);
		cy.findByText(todayDayName);
		cy.findByText("4 words");

		cy.checkA11y();

		cy.findByText("Show").click();

		cy.url().should("contain", journalUrl);
	});

	it("error while getting journals", () => {
		const errorMessage = "Cannot fetch journals, please try again.";

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/journals",
			status: 500,
			response: {},
		});

		cy.login("dwight");
		cy.visit(JOURNALS_URL);

		cy.findByText(errorMessage);
		cy.findByText("Couldn't fetch journals.");
		cy.findByText("You don't have any journals yet.").should("not.exist");

		cy.route({
			method: "GET",
			url: "/api/v1/journals",
			status: 200,
			response: [],
		});

		cy.findByText("Retry").click();

		cy.findByText(errorMessage).should("not.exist");
		cy.findByText("Retry").should("not.exist");
		cy.findByText("You don't have any journals yet.");
	});
});
