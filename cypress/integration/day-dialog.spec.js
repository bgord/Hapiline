/* eslint-disable sonarjs/no-identical-functions */

import {format, getDate} from "date-fns";

const CALENDAR_URL = "/calendar";
const DASHBOARD_URL = "/dashboard";

const today = Date.now();

// Today's day, e.g 9 for May 9th
const dayOfTheMonthToday = getDate(today);

// Today's day index, e.g 8 for May 9th
const dayOfTheMonthTodayIndex = dayOfTheMonthToday - 1;

describe("day dialog", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("dialog", () => {
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.injectAxe();

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
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

			cy.checkA11y('div[role="dialog"]', {
				rules: {
					// Disabled due to a slight issue with the `ESTABLISHED` badge
					"color-contrast": {
						enabled: false,
					},
				},
			});

			cy.findByText("Tracked habits");
			cy.findByText("2 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("6 habits with no votes");

			if (Cypress.env("device") === "desktop") {
				cy.findByText("Show new habits").click();
				cy.findByText("4");
				cy.findByText("habits added this day");

				cy.findByText("Show untracked habits").click();
			}

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
				.should("be.empty")
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
			cy.findByPlaceholderText("Search for habits...").should("be.empty");
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
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.server();

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		}
		cy.findByText("Habits").click();

		cy.findByText("New habit").click();

		cy.findByRole("dialog").within(() => {
			cy.findByLabelText("Habit name").type("THE NOT TRACKED ONE");
			cy.findByLabelText("Track this habit").click();

			cy.findByText("Add habit").click();
			cy.findByText("Close dialog").click({force: true});
		});

		if (Cypress.env("device") === "mobile") {
			cy.findByText("Menu").click();
		}
		cy.findByText("Calendar").click();
		if (Cypress.env("device") === "mobile") {
			cy.findAllByText("Close dialog")
				.first()
				.click({force: true});
		}

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => cy.findByText("Show").click());
		});

		if (Cypress.env("device") === "desktop") {
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
		}
	});

	it("habit votes", () => {
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
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
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
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

			cy.findAllByText("Save")
				.first()
				.click();
		});

		cy.findByText("Comment added successfully!");

		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => cy.findByText("Show").click({force: true}));
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
		cy.login("dwight");
		cy.visit(CALENDAR_URL);

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => cy.findByText("Show").click());
		});

		cy.findByRole("dialog").within(() => {
			cy.findAllByText("Show and edit vote comment")
				.eq(1)
				.click({force: true});

			cy.findByPlaceholderText("Write something...").type("where are the turtles");

			cy.findAllByText("Save")
				.first()
				.click();

			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByText("Comment added successfully!");

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => cy.findByText("Show").click({force: true}));
		});
		cy.findByRole("dialog").within(() => {
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByTestId("calendar").within(() => {
			cy.findAllByTestId("day")
				.eq(dayOfTheMonthTodayIndex)
				.within(() => cy.findByText("Show").click({force: true}));
		});
		cy.findByRole("dialog").within(() => {
			cy.findAllByText("Show and edit vote comment")
				.eq(1)
				.click({force: true});
			cy.findByPlaceholderText("Write something...").should("have.value", "where are the turtles");
		});
	});

	it("correct search by highlighted_habit_id", () => {
		const today = format(new Date(), "yyyy-MM-dd");

		const urlOfHabitHighlightedInDashboardDayPreview = `http://hapiline.localhost/dashboard?subview=day_preview&preview_day=${today}&highlighted_habit_id=31`;

		cy.login("pam");
		cy.visit(DASHBOARD_URL);

		cy.findAllByText("No vote yet")
			.first()
			.click();

		cy.url().should("be.equal", urlOfHabitHighlightedInDashboardDayPreview);

		cy.findByRole("dialog").within(() => {
			cy.findAllByText("0 lorem");
			cy.findByText("10 loremlorem").should("not.exist");

			cy.findByTestId("day-dialog-habits")
				.children()
				.should("have.length", 1);
		});
	});
});
