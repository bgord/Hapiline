/* eslint-disable sonarjs/no-identical-functions */

import {format} from "date-fns";

const DASHBOARD_URL = "/dashboard";

const today = format(new Date(), "yyyy-MM-dd");

describe("Dashboard", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("upper part", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("Hello!");

		cy.findByText("View today").click();
		cy.url().should(
			"include",
			`/dashboard?subview=day_preview&preview_day=${today}&habit_vote_filter=unvoted`,
		);

		cy.go("back");

		cy.get("div")
			.eq(6)
			.should(
				"include.text",
				"You're on a good track!You have 6 tracked habits to vote for left out of 10 (and 0 untracked habits).",
			);

		cy.findByTestId("chart-today").within(() => {
			cy.findByText("Votes today");

			cy.findByText("2 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("6 habits with no votes");

			cy.findByTitle("No votes: 6/10 (60.00%)");
			cy.findByTitle("Regress: 1/10 (10.00%)");
			cy.findByTitle("Plateau: 1/10 (10.00%)");
			cy.findByTitle("Progress: 2/10 (20.00%)");
		});

		cy.findByTestId("chart-last-week").within(() => {
			cy.findByText("Votes last week");

			cy.findByText("3 habits with progress votes");
			cy.findByText("2 habits with plateau votes");
			cy.findByText("2 habits with regress votes");
			cy.findByText("12 habits with no votes");

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

		cy.wait(1000);

		cy.get("div")
			.eq(6)
			.should(
				"include.text",
				"Start your day well! You have 10 tracked habits to vote for. And 2 untracked habits.",
			);

		cy.findByTestId("chart-today").within(() => {
			cy.findByText("Votes today");

			cy.findByText("0 habits with progress votes");
			cy.findByText("0 habits with plateau votes");
			cy.findByText("0 habits with regress votes");
			cy.findByText("10 habits with no votes");

			cy.findByTitle("No votes: 10/10 (100.00%)");
		});

		cy.findByTestId("chart-last-week").within(() => {
			cy.findByText("Votes last week");
			cy.findByText("1 habits with progress votes");
			cy.findByText("1 habits with plateau votes");
			cy.findByText("1 habits with regress votes");
			cy.findByText("69 habits with no votes");
		});

		cy.findByTestId("chart-last-month").within(() => {
			cy.findByText("Votes last month");
			cy.findByText("2 habits with progress votes");
			cy.findByText("2 habits with plateau votes");
			cy.findByText("2 habits with regress votes");
			cy.findByText("234 habits with no votes");
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

		cy.wait(1000);

		cy.get("div")
			.eq(6)
			.should(
				"include.text",
				"Congratulations! You voted for every one of 10 tracked habits today! You also have 3 untracked habits.",
			);

		cy.findByTestId("chart-today").within(() => {
			cy.findByText("Votes today");
			cy.findByText("10 habits with progress votes");
			cy.findByText("0 habits with plateau votes");
			cy.findByText("0 habits with regress votes");
			cy.findByText("0 habits with no votes");
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
		cy.findByText("Add your first tracked habit to start voting!");

		cy.findByText("Votes today").should("not.exist");
		cy.findByText("0 habits with progress votes").should("not.exist");
		cy.findByText("0 habits with plateau votes").should("not.exist");
		cy.findByText("0 habits with regress votes").should("not.exist");
		cy.findByText("0 habits with no votes").should("not.exist");

		cy.findByText("Add your first tracked habit to start voting!").click();
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

		cy.findByText("Notifications dropdown").click({force: true});

		cy.get("#notification-list").within(() => {
			cy.findByText("Notifications");
			cy.findByText("1");

			cy.findByText("Read");
			cy.findByText("Unread");

			cy.findAllByText("Congratulations! You did something good.").should("have.length", 2);

			cy.findByText("Read").click();

			cy.findByText("Read").should("not.exist");
			cy.findAllByText("Unread").should("have.length", 2);

			cy.findByText("Notifications");
			cy.findByText("0");

			cy.findByText("Close dialog").click({force: true});
		});

		cy.get("#notification-list").should("not.exist");
	});

	it("streak stats", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-streak-stats",
			status: 200,
			response: {
				progress_streaks: [
					{id: 1, name: "first", progress_streak: 3},
					{id: 2, name: "second", progress_streak: 2},
					{id: 3, name: "third", progress_streak: 1},
				],
				regress_streaks: [
					{id: 4, name: "fourth", regress_streak: 4},
					{id: 5, name: "fifth", regress_streak: 2},
					{id: 6, name: "sixth", regress_streak: 1},
				],
			},
		});

		cy.findByText("Progress streaks");
		cy.findByText("3 days progress streak");
		cy.findByText("2 days progress streak");
		cy.findByText("1 day progress streak");

		cy.findByText("Regress streaks");
		cy.findByText("4 days regress streak");
		cy.findByText("2 days regress streak");
		cy.findByText("1 day regress streak");

		cy.findByText("first").should(
			"have.attr",
			"href",
			"/dashboard?subview=habit_preview&preview_habit_id=1",
		);
		cy.findByText("second").should(
			"have.attr",
			"href",
			"/dashboard?subview=habit_preview&preview_habit_id=2",
		);
		cy.findByText("third").should(
			"have.attr",
			"href",
			"/dashboard?subview=habit_preview&preview_habit_id=3",
		);
		cy.findByText("fourth").should(
			"have.attr",
			"href",
			"/dashboard?subview=habit_preview&preview_habit_id=4",
		);
		cy.findByText("fifth").should(
			"have.attr",
			"href",
			"/dashboard?subview=habit_preview&preview_habit_id=5",
		);
		cy.findByText("sixth").should(
			"have.attr",
			"href",
			"/dashboard?subview=habit_preview&preview_habit_id=6",
		);
	});

	it("streak stats error", () => {
		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-streak-stats",
			status: 400,
			response: {},
		});

		cy.findByText("Couldn't fetch dashboard streak stats.");
	});

	it("Dashboard streaks get refreshed after a vote from the View Today modal", () => {
		cy.login("jim");
		cy.visit(DASHBOARD_URL);

		cy.findByText("1 day progress streak");
		cy.findByText("2 days progress streak").should("not.exist");

		cy.findByText("View today").click();

		cy.findByRole("dialog").within(() => {
			cy.findByText("Show voted (2)").click({force: true});

			cy.findAllByText("Add progress vote")
				.first()
				.click({force: true});

			cy.findByText("Close dialog").click({force: true});
		});

		cy.findByText("1 day progress streak").should("not.exist");
		cy.findByText("2 days progress streak");
	});

	it("journal textarea is available in a day dialog", () => {
		cy.login("jim");
		cy.visit(DASHBOARD_URL);

		cy.findByText("View today").click();

		cy.findByRole("dialog").within(() => {
			cy.findAllByText("Journal")
				.first()
				.click();
			cy.findAllByLabelText("Journal");
		});
	});

	it("no vote badge is shown where there's no vote for given habit today", () => {
		cy.login("jim");
		cy.visit(DASHBOARD_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/dashboard-streak-stats",
			status: 200,
			response: {
				progress_streaks: [
					{
						id: 1,
						name: "First habit",
						has_vote_for_today: true,
						progress_streak: 5,
					},
					{
						id: 2,
						name: "Second habit",
						has_vote_for_today: false,
						progress_streak: 6,
					},
				],
				regress_streaks: [
					{
						id: 3,
						name: "Third habit",
						has_vote_for_today: false,
						regress_streak: 7,
					},
					{
						id: 4,
						name: "Fourth habit",
						has_vote_for_today: true,
						regress_streak: 8,
					},
				],
			},
		});

		cy.findAllByText("No vote").should("have.length", 2);
		cy.findAllByText("No vote").should("have.attr", "title", "Vote for this habit");

		cy.findAllByText("No vote")
			.eq(0)
			.should("have.attr", "href", `/calendar?preview_day=${today}&highlighted_habit_id=3`);

		cy.findAllByText("No vote")
			.eq(1)
			.should("have.attr", "href", `/calendar?preview_day=${today}&highlighted_habit_id=2`);
	});
});
