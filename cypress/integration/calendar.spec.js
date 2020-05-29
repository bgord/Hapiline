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
		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", daysInCurrentMonth);

			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => {
					cy.findByText("4 new habits");
					cy.findByText("2 habits with progress votes");
					cy.findByText("1 habits with plateau votes");
					cy.findByText("1 habits with regress votes");
					cy.findByText("6 habits with no votes");
				});
		});

		cy.findByText("Previous").click();
		cy.findByText(previousMonthString);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", daysInPreviousMonth);
			cy.findByText("new:").should("not.exist");
		});

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", daysInCurrentMonth);
			cy.findByText("4 new habits");
		});

		cy.findByText("Next").click();
		cy.findByText(currentMonthString);
		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", daysInCurrentMonth);
			cy.findByText("4 new habits");
		});
	});

	it("untracked habits are not shown in the calendar tiles", () => {
		cy.viewport(1700, 1700);

		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findByText(currentMonthString);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day").should("have.length", daysInCurrentMonth);

			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => {
					cy.findByText("4 new habits");
					cy.findByText("2 habits with progress votes");
					cy.findByText("1 habits with plateau votes");
					cy.findByText("1 habits with regress votes");
					cy.findByText("6 habits with no votes");
				});
		});

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
			cy.findAllByTestId("day").should("have.length", daysInCurrentMonth);

			cy.findAllByTestId("day")
				.eq(currentDate - 1)
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

		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findByText(currentMonthString);
		cy.findByText(errorMessage);
	});

	it("dialog", () => {
		cy.viewport(2000, 2000);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => {
					cy.findByTitle("No votes: 6/10 (60.00%)");
					cy.findByTitle("Regress: 1/10 (10.00%)");
					cy.findByTitle("Plateau: 1/10 (10.00%)");
					cy.findByTitle("Progress: 2/10 (20.00%)");
					cy.findByText("Show").click();
				});
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText(`${format(new Date(), "yyyy-MM-dd")} - ${format(new Date(), "iiii")}`);

			cy.findByText("Tracked habits");
			cy.findByText("2 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("6 habits with no votes");

			cy.findByText("Show new habits").click();
			cy.findByText("4");
			cy.findByText("habits added this day");
			cy.findByText("Show untracked habits").click();

			cy.findByLabelText("Show voted (4)").should("not.be.checked");
			cy.findByLabelText("Show unvoted (6)").should("be.checked");
			cy.findByLabelText("Show all (10)").should("not.be.checked");

			cy.findByLabelText("Show all (10)").click();

			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 10);

			cy.findByTestId("day-dialog-habits").within(() => {
				cy.findAllByText("positive").should("have.length", 4);
				cy.findAllByText("neutral").should("have.length", 3);
				cy.findAllByText("negative").should("have.length", 3);

				cy.findAllByText("established").should("have.length", 4);
				cy.findAllByText("developing").should("have.length", 3);
				cy.findAllByText("fresh").should("have.length", 3);
			});

			cy.findByPlaceholderText("Search for habits...")
				.should("have.value", "")
				.type("0");

			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 1);
			cy.findByText("Clear").click();

			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 10);

			cy.findByLabelText("Show voted (4)").check();
			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 4);

			cy.findByLabelText("Show unvoted (6)").check();
			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 6);

			cy.findByPlaceholderText("Search for habits...").type("xxx");

			cy.findByText("Reset filters").click();
			cy.findByPlaceholderText("Search for habits...").should("have.value", "");
			cy.findByLabelText("Show voted (4)").should("not.be.checked");
			cy.findByLabelText("Show unvoted (6)").should("not.be.checked");
			cy.findByLabelText("Show all (10)").should("be.checked");

			// Collapsing tracked habits section
			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 10);
			cy.findByText("Hide tracked habits").click({force: true});

			cy.findByTestId("day-dialog-habits").should("not.exist");

			cy.findByText("Show tracked habits").click({force: true});
			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 10);

			cy.findByText("Close dialog").click({force: true});
		});
		cy.findByRole("dialog").should("not.exist");
	});

	it("doesn't render not trackable habits", () => {
		cy.server();

		cy.viewport(2000, 2000);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findByText("Habits").click();
		cy.findByText("New habit").click();

		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").type("THE NOT TRACKED ONE");
			cy.findByLabelText("Track this habit").click();

			cy.findByText("Add habit").click();
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findByText("Calendar").click();

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("Show new habits").click();

			cy.findAllByText("5");
			cy.findByText("habits added this day");

			cy.findAllByText("Untracked");

			cy.findByText("Show untracked habits").click();
			cy.findByText("One");
			cy.findByText("untracked habit available this day.");

			cy.findAllByText("THE NOT TRACKED ONE");
		});
	});

	it("habit votes", () => {
		cy.viewport(1700, 1700);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("Show all (10)").click();

			cy.findByText("2 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("6 habits with no votes");

			cy.findAllByText("Add progress vote")
				.first()
				.click({force: true});

			cy.findByText("3 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("5 habits with no votes");

			cy.wait(10);

			cy.findAllByText("Add progress vote")
				.first()
				.click({force: true});

			cy.findByText("2 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("6 habits with no votes");

			cy.findAllByText("Add regress vote")
				.eq(2)
				.click({force: true});

			cy.findByText("2 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("0 habits with regress votes");
			cy.findByText("7 habits with no votes");
		});

		cy.findAllByText("Habit vote added successfully!");
	});

	it("vote comments", () => {
		cy.viewport(1200, 1200);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("Show all (10)").click();
			cy.findAllByText("Show and edit vote comment").should("have.length", 10);
			cy.findByPlaceholderText("Write something...").should("not.exist");

			cy.findAllByText("Show and edit vote comment")
				.eq(2)
				.click({force: true});
			cy.findAllByText("Show and edit vote comment").should("have.length", 9);
			cy.findByText("Hide vote comment").should("have.length", 1);

			cy.findByDisplayValue("loremloremloremloremloremloremlorem");

			cy.findByText("Hide vote comment").click({force: true});
			cy.findAllByText("Show and edit vote comment").should("have.length", 10);
			cy.findByText("Hide vote comment").should("not.exist");
			cy.findByDisplayValue("loremloremloremloremloremloremlorem").should("not.exist");

			cy.findAllByText("Show and edit vote comment")
				.eq(2)
				.click({force: true});
			cy.findByDisplayValue("loremloremloremloremloremloremlorem").type("xxx");

			cy.findByDisplayValue("loremloremloremloremloremloremloremxxx");
			cy.findByText("Cancel").click();

			cy.findByDisplayValue("loremloremloremloremloremloremlorem");

			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("nonono");

			cy.findByText("Save").click();
		});

		cy.findByText("Comment added successfully!");

		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});

		cy.findByRole("dialog").within(() => {
			cy.findByText("Show all (10)").click();
			cy.findAllByText("Show and edit vote comment")
				.eq(2)
				.click({force: true});
			cy.findByDisplayValue("nonono");
		});
	});

	it("add a comment to a habit with no vote", () => {
		cy.viewport(1200, 1200);
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});

		cy.findByRole("dialog").within(() => {
			cy.findAllByText("Show and edit vote comment")
				.eq(1)
				.click({force: true});

			cy.findByPlaceholderText("Write something...").type("where are the turtles");

			cy.findByText("Save").click();

			cy.findByText("Close dialog").click({force: true});
		});

		cy.findByText("Comment added successfully!");

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});
		cy.findByRole("dialog").within(() => {
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(currentDate - 1)
				.within(() => cy.findByText("Show").click());
		});
		cy.findByRole("dialog").within(() => {
			cy.findAllByText("Show and edit vote comment")
				.eq(1)
				.click({force: true});
			cy.findByPlaceholderText("Write something...").should("have.value", "where are the turtles");
		});
	});
});
