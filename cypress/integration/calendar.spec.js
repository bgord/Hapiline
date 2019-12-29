/* eslint-disable sonarjs/no-identical-functions */

import {format, getDaysInMonth, subMonths} from "date-fns";

const CALENDAR_URL = "/calendar";

const today = Date.now();

const currentMonthString = format(today, "MMMM yyyy");
const daysInCurrentMonth = getDaysInMonth(today);

const previousMonthString = format(subMonths(today, 1), "MMMM yyyy");
const daysInPreviousMonth = getDaysInMonth(new Date(previousMonthString));

describe("Calendar", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("navigating through months", () => {
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findByText(currentMonthString);

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.get("ul").within(() => {
			cy.get("li").should("have.length", daysInCurrentMonth);
			cy.findAllByText("NEW: 3").should("have.length", 2);
			cy.findByText("NEW: 4");
		});

		cy.findByText("Previous").click();
		cy.findByText(previousMonthString);

		cy.get("ul").within(() => {
			cy.get("li").should("have.length", daysInPreviousMonth);
			cy.findByText("NEW:").should("not.exist");
		});

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.get("ul").within(() => {
			cy.get("li").should("have.length", daysInCurrentMonth);
			cy.findAllByText("NEW: 3").should("have.length", 2);
			cy.findByText("NEW: 4");
		});

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.get("ul").within(() => {
			cy.get("li").should("have.length", daysInCurrentMonth);
			cy.findAllByText("NEW: 3").should("have.length", 2);
			cy.findByText("NEW: 4");
		});
	});
});
