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
		cy.viewport(1700, 1700);

		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findByText(currentMonthString);

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.get("ul").within(() => {
			cy.get("li").should("have.length", daysInCurrentMonth);

			cy.get("li")
				.eq(currentDate - 1)
				.within(() => {
					cy.findByText("NEW: 4");
					cy.findByText("+2");
					cy.findByText("=1");
					cy.findByText("-1");
					cy.findByText("?6");
				});
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
			cy.findByText("NEW: 4");
		});

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.get("ul").within(() => {
			cy.get("li").should("have.length", daysInCurrentMonth);
			cy.findByText("NEW: 4");
		});
	});

	it("get month error", () => {
		const errorMessage = "Unexpected error, try again later.";

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/month?monthOffset=0",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findByText(currentMonthString);
		cy.findByText(errorMessage);
	});

	it("dialog", () => {
		cy.viewport(2000, 2000);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.get("ul").within(() => {
			cy.get("li")
				.eq(currentDate - 1)
				.within(() => {
					cy.findByText("Show day").click({force: true});
				});
		});

		cy.findByRole("dialog").within(() => {
			cy.findByTestId("day-dialog-habits").within(() => {
				cy.get("li").should("have.length", 10);
			});

			cy.findByText("NEW: 4");
			cy.findByText("+2");
			cy.findByText("=1");
			cy.findByText("-1");
			cy.findByText("?6");

			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("established").should("have.length", 4);
			cy.findAllByText("developing").should("have.length", 3);
			cy.findAllByText("fresh").should("have.length", 3);

			cy.findByLabelText("Show voted (4)").should("not.be.checked");
			cy.findByLabelText("Show unvoted (6)").should("not.be.checked");
			cy.findByLabelText("Show all (10)").should("be.checked");

			cy.findByPlaceholderText("Search for habits...")
				.should("have.value", "")
				.type("0");
			cy.findByTestId("day-dialog-habits").within(() => {
				cy.get("li").should("have.length", 1);
			});
			cy.findByText("Clear").click();
			cy.findByTestId("day-dialog-habits").within(() => {
				cy.get("li").should("have.length", 10);
			});

			cy.findByLabelText("Show voted (4)").check();
			cy.findByTestId("day-dialog-habits").within(() => {
				cy.get("li").should("have.length", 4);
			});

			cy.findByLabelText("Show unvoted (6)").check();
			cy.findByTestId("day-dialog-habits").within(() => {
				cy.get("li").should("have.length", 6);
			});

			cy.findByPlaceholderText("Search for habits...").type("xxx");

			cy.findByText("Reset filters").click();
			cy.findByPlaceholderText("Search for habits...").should("have.value", "");
			cy.findByLabelText("Show voted (4)").should("not.be.checked");
			cy.findByLabelText("Show unvoted (6)").should("not.be.checked");
			cy.findByLabelText("Show all (10)").should("be.checked");

			cy.findByText("×").click();
		});
		cy.findByRole("dialog").should("not.exist");
	});

	it("habit votes", () => {
		cy.viewport(1700, 1700);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.get("ul").within(() => {
			cy.get("li")
				.eq(currentDate - 1)
				.within(() => {
					cy.findByText("Show day").click({force: true});
				});
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("+2");
			cy.findByText("=1");
			cy.findByText("-1");
			cy.findByText("?6");

			cy.findAllByText("+")
				.first()
				.click();

			cy.findByText("+3");
			cy.findByText("=1");
			cy.findByText("-1");
			cy.findByText("?5");

			cy.findAllByText("+")
				.first()
				.click();

			cy.findByText("+2");
			cy.findByText("=1");
			cy.findByText("-1");
			cy.findByText("?6");

			cy.findAllByText("-")
				.eq(2)
				.click();

			cy.findByText("+2");
			cy.findByText("=1");
			cy.findByText("-0");
			cy.findByText("?7");
		});

		cy.findAllByText("Habit vote added successfully!");
	});
});
