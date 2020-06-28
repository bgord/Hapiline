/* eslint-disable sonarjs/no-identical-functions */

import {format, getDate, getDaysInMonth, subMonths} from "date-fns";

const CALENDAR_URL = "/calendar";

const today = Date.now();

// E.g 31 for May
const numberOfDaysInCurrentMonth = getDaysInMonth(today);

// Today's day, e.g 9 for May 9th
const dayOfTheMonthToday = getDate(today);

// Today's day index, e.g 8 for May 9th
const dayOfTheMonthTodayIndex = dayOfTheMonthToday - 1;

// A current month string like `May 2020`
const currentMonthString = format(today, "MMMM yyyy");

describe("Calendar", () => {
	before(() => {
		cy.request("POST", "/test/db/seed");
	});

	beforeEach(() => {
		cy.login("dwight");
		cy.visit(CALENDAR_URL);
	});

	it("disabling previous/next buttons", () => {
		cy.injectAxe();

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: [
				{
					id: 1,
					name: "Watch The Office",
					score: "positive",
					strength: "established",
					is_trackable: true,
					created_at: today,
				},
			],
		});

		// The "next" button is disabled by default, because
		// we land on the current month.
		cy.findByText("Next")
			.should("be.disabled")
			.should("have.attr", "title", "You cannot access the next month yet");

		// The "previous" button is disabled, because
		// the only habit that exists is created today,
		// so there're no other habits accessible the month before.
		cy.findByText("Previous")
			.should("be.disabled")
			.should("have.attr", "title", "There are no habits added in the previous month");

		cy.checkA11y("html", {
			rules: {
				// Disabled due to a slight issue with the `x NEW HABITS` text color
				"color-contrast": {
					enabled: false,
				},
			},
		});

		// Another scenario, the only habit is created a month ago.
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: [
				{
					id: 1,
					name: "Watch The Office",
					score: "positive",
					strength: "established",
					is_trackable: true,
					created_at: subMonths(today, 1),
				},
			],
		});

		cy.reload();

		// The "next" button is disabled by default, because
		// we land on the current month.
		cy.findByText("Next")
			.should("be.disabled")
			.should("have.attr", "title", "You cannot access the next month yet");

		// The "previous" button is enabled, because
		// the only habit that exists is created a month ago,
		cy.findByText("Previous")
			.should("not.be.disabled")
			.should("have.attr", "title", "Go to previous month");

		// Going to the previous month
		cy.findByText("Previous").click();

		// We can still go back to the current month.
		cy.findByText("Next")
			.should("not.be.disabled")
			.should("have.attr", "title", "Go to next month");

		// We can't go any earlier
		cy.findByText("Previous")
			.should("be.disabled")
			.should("have.attr", "title", "There are no habits added in the previous month");
	});

	it("content of the latest day tile", () => {
		cy.findByText(currentMonthString);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", numberOfDaysInCurrentMonth);

			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => {
					cy.findByText("4 new habits");

					// Assert the text values of the chart at the bottom of the day tile
					// which are `ViuallyHidden`.
					cy.findByText("2 habits with progress votes");
					cy.findByText("1 habits with plateau votes");
					cy.findByText("1 habits with regress votes");
					cy.findByText("6 habits with no votes");
				});

			cy.findAllByTestId("day").should("have.length", numberOfDaysInCurrentMonth);
		});
	});

	it("untracked habits are not shown in the calendar tiles", () => {
		cy.findByText(currentMonthString);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", numberOfDaysInCurrentMonth);

			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => {
					cy.findByText("4 new habits");
					cy.findByText("2 habits with progress votes");
					cy.findByText("1 habits with plateau votes");
					cy.findByText("1 habits with regress votes");
					cy.findByText("6 habits with no votes");
				});
		});

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		}
		cy.findByText("Habits").click();

		cy.findByText("New habit").click();

		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").type("THE SPECIAL ONE");
			cy.findByLabelText("Track this habit").click();

			cy.findByText("Add habit").click();
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findByText("Habit successfully addedd!");

		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", numberOfDaysInCurrentMonth);

			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => {
					cy.findByText("5 new habits");
					cy.findByText("2 habits with progress votes");
					cy.findByText("1 habits with plateau votes");
					cy.findByText("1 habits with regress votes");
					cy.findByText("6 habits with no votes");
				});
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

		cy.findByText(currentMonthString);
		cy.findByText(errorMessage);
	});

	it("offline simulation", () => {
		cy.server();
		cy.route({
			method: "GET",
			status: 500,
			url: "/api/v1/month?monthOffset=0",
			response: {},
		});

		cy.findByText("Couldn't fetch calendar stats");
	});
});
