/* eslint-disable sonarjs/no-identical-functions */

import {format, getDate, getDaysInMonth, subMonths} from "date-fns";

const CALENDAR_URL = "/calendar";

const today = Date.now();

const currentMonthString = format(today, "MMMM yyyy");
const daysInCurrentMonth = getDaysInMonth(today);

const previousMonthString = format(subMonths(today, 1), "MMMM yyyy");
const daysInPreviousMonth = getDaysInMonth(new Date(previousMonthString));

const currentDate = getDate(today);

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

	it("dialog", () => {
		cy.viewport(2000, 2000);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("show day")
				.should("have.length", daysInCurrentMonth)
				.should("not.be.visible");

			cy.findAllByText("show day")
				.eq(currentDate - 1)
				.click({force: true});
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("NEW: 4");
			cy.findByText("×").click();
		});
		cy.findByRole("dialog").should("not.exist");

		cy.get("ul").within(() => {
			cy.findAllByText("show day")
				.should("have.length", daysInCurrentMonth)
				.should("not.be.visible");

			cy.findAllByText("show day")
				.eq(currentDate - 2)
				.click({force: true});
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("NEW: 3");
			cy.findByText("×").click();
		});
		cy.findByRole("dialog").should("not.exist");
	});
});
