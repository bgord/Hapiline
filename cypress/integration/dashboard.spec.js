/* eslint-disable sonarjs/no-identical-functions */

import {formatDay} from "../../frontend/src/config/DATE_FORMATS";

const DASHBOARD_URL = "/dashboard";

describe("Dashboard", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("upper part", () => {
		const today = formatDay(new Date());

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.findByText("Hello!");

		cy.findByText("View today").click();
		cy.url().should("include", `/calendar?preview_day=${today}&habit_vote_filter=unvoted`);
		cy.go("back");

		cy.get("p").should(
			"have.text",
			"You're on a good track! You have 5 habits to vote for left out of 10.",
		);
		cy.findByText("Votes today");
		cy.findByText("?5");
		cy.findByText("-1");
		cy.findByText("=1");
		cy.findByText("+2");

		cy.server();
		cy.route({
			method: "GET",
			url: `/api/v1/day-votes?day=${today}`,
			status: 200,
			response: [],
		});
		cy.reload();
		cy.get("p").should("have.text", "Start your day well! You have 10 habits to vote for.");
		cy.findByText("Votes today");
		cy.findByText("?10");
		cy.findByText("-0");
		cy.findByText("=0");
		cy.findByText("+0");

		cy.route({
			method: "GET",
			url: `/api/v1/day-votes?day=${today}`,
			status: 200,
			response: Array.from({length: 10}).map(() => ({vote: "progress"})),
		});
		cy.reload();
		cy.get("p").should("have.text", "Congratulations! You voted for every one of 10 habits today!");
		cy.findByText("Votes today");
		cy.findByText("?0");
		cy.findByText("-0");
		cy.findByText("=0");
		cy.findByText("+10");

		cy.route({
			method: "GET",
			url: `/api/v1/day-votes?day=${today}`,
			status: 200,
			response: [],
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: [],
		});
		cy.reload();
		cy.get("p").should("have.text", "Add your first habit to start voting!");
		cy.findByText("Votes today").should("not.exist");
		cy.findByText("?0").should("not.exist");
		cy.findByText("-0").should("not.exist");
		cy.findByText("=0").should("not.exist");
		cy.findByText("+0").should("not.exist");

		cy.get("p")
			.should("have.text", "Add your first habit to start voting!")
			.click();
		cy.url().should("contain", "/habits");
	});

	it("upper part request errors", () => {
		const today = formatDay(new Date());

		cy.login("dwight");
		cy.visit(DASHBOARD_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: `/api/v1/day-votes?day=${today}`,
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

		cy.findByText("Couldn't fetch habit votes.");
		cy.findByText("Couldn't fetch habit list.");

		cy.findByText("Cannot load dashboard stats now, try again.");
	});
});
