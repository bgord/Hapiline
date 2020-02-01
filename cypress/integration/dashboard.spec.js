/* eslint-disable sonarjs/no-identical-functions */

import {format} from "date-fns";

const DASHBOARD_URL = "/dashboard";

describe("Dashboard", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("upper part", () => {
		const today = format(new Date(), "yyyy-MM-dd");

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("Hello!");

		cy.findByText("View today").click();
		cy.url().should(
			"include",
			`/dashboard?subview=day_preview&preview_day=${today}&habit_vote_filter=unvoted`,
		);

		cy.go("back");

		cy.get("p").should(
			"have.text",
			"You're on a good track! You have 6 tracked habits to vote for left out of 10. And 0 untracked habits.",
		);

		cy.findByTestId("chart-today").within(() => {
			cy.findByText("Votes today");
			cy.findByText("?6");
			cy.findByText("-1");
			cy.findByText("=1");
			cy.findByText("+2");
			cy.findByTitle("No votes: 6/10 (60.00%)");
			cy.findByTitle("Regress: 1/10 (10.00%)");
			cy.findByTitle("Plateau: 1/10 (10.00%)");
			cy.findByTitle("Progress: 2/10 (20.00%)");
		});

		cy.findByTestId("chart-last-week").within(() => {
			cy.findByText("Votes last week");
			cy.findByText("?12");
			cy.findByText("-2");
			cy.findByText("=2");
			cy.findByText("+3");
			cy.findByTitle("No votes: 12/19 (63.16%)");
			cy.findByTitle("Regress: 2/19 (10.53%)");
			cy.findByTitle("Plateau: 2/19 (10.53%)");
			cy.findByTitle("Progress: 3/19 (15.79%)");
		});

		cy.findByTestId("chart-last-month").should("not.exist");

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-stats",
			status: 200,
			response: {
				today: {
					progressVotes: 0,
					plateauVotes: 0,
					regressVotes: 0,
					noVotes: 10,
					allVotes: 0,
					maximumVotes: 10,
					untrackedHabits: 2,
				},
				lastWeek: {
					progressVotes: 1,
					plateauVotes: 1,
					regressVotes: 1,
					noVotes: 69,
					allVotes: 3,
					maximumVotes: 72,
				},
				lastMonth: {
					progressVotes: 2,
					plateauVotes: 2,
					regressVotes: 2,
					noVotes: 234,
					allVotes: 6,
					maximumVotes: 240,
				},
			},
		});
		cy.reload();
		cy.get("p").should(
			"have.text",
			"Start your day well! You have 10 tracked habits to vote for. And 2 untracked habits.",
		);

		cy.findByTestId("chart-today").within(() => {
			cy.findByText("Votes today");
			cy.findByText("?10");
			cy.findByText("-0");
			cy.findByText("=0");
			cy.findByText("+0");
			cy.findByTitle("No votes: 10/10 (100.00%)");
		});

		cy.findByTestId("chart-last-week").within(() => {
			cy.findByText("Votes last week");
			cy.findByText("?69");
			cy.findByText("-1");
			cy.findByText("=1");
			cy.findByText("+1");
		});

		cy.findByTestId("chart-last-month").within(() => {
			cy.findByText("Votes last month");
			cy.findByText("?234");
			cy.findByText("-2");
			cy.findByText("=2");
			cy.findByText("+2");
		});

		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-stats",
			status: 200,
			response: {
				today: {
					progressVotes: 10,
					plateauVotes: 0,
					regressVotes: 0,
					maximumVotes: 10,
					noVotes: 0,
					allVotes: 10,
					untrackedHabits: 3,
				},
			},
		});
		cy.reload();
		cy.get("p").should(
			"have.text",
			"Congratulations! You voted for every one of 10 tracked habits today! You also have 3 untracked habits.",
		);

		cy.findByTestId("chart-today").within(() => {
			cy.findByText("Votes today");
			cy.findByText("?0");
			cy.findByText("-0");
			cy.findByText("=0");
			cy.findByText("+10");
			cy.findByTitle("Progress: 10/10 (100.00%)");
		});

		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-stats",
			status: 200,
			response: {
				today: {
					progressVotes: 0,
					plateauVotes: 0,
					regressVotes: 0,
					maximumVotes: 0,
					noVotes: 0,
					allVotes: 0,
					untrackedHabits: 0,
				},
			},
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: [],
		});
		cy.reload();
		cy.get("p").should("have.text", "Add your first tracked habit to start voting!");

		cy.findByText("Votes today").should("not.exist");
		cy.findByText("?0").should("not.exist");
		cy.findByText("-0").should("not.exist");
		cy.findByText("=0").should("not.exist");
		cy.findByText("+0").should("not.exist");

		cy.get("p")
			.should("have.text", "Add your first tracked habit to start voting!")
			.click();
		cy.url().should("contain", "/habits");
	});

	it("upper part request errors", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-stats",
			status: 500,
			response: {},
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: "Some error message",
				argErrors: [],
			},
		});

		cy.findByText("Couldn't fetch dashboard stats.");
		cy.findByText("Couldn't fetch habit list.");

		cy.findByText("Cannot load dashboard stats now, please try again.");
	});

	it("notifications", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByLabelText("Notification bell").click();

		cy.get("#notification-list").within(() => {
			cy.findByText("Notifications (1)");

			cy.findByText("Mark as read");
			cy.findByText("Mark as unread");

			cy.findAllByText("Congratulations! You did something good.").should("have.length", 2);

			cy.findByText("Mark as read").click();

			cy.findByText("Mark as read").should("not.exist");
			cy.findAllByText("Mark as unread").should("have.length", 2);

			cy.findByText("Notifications (0)");

			cy.findByText("×").click();
		});

		cy.get("#notification-list").should("not.exist");
	});
});
