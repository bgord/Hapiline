/* eslint-disable sonarjs/no-identical-functions */

const HABITS_URL = "/habits";

describe("habit dialog", () => {
	beforeEach(() => {
		cy.request("POST", "/test/db/seed");
	});

	it("deleting items", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem");

		cy.findAllByText("More")
			.first()
			.click();
		cy.findByText("Delete").click();

		cy.findByText("Nevermind, don't delete").click();
		cy.findByText("Close dialog").click({force: true});
		cy.findByText("0 lorem");

		if (Cypress.env("device" === "desktop")) {
			cy.findByText("Show filters").click();

			cy.findByText("Positive (4)");
			cy.findByText("Neutral (3)");
			cy.findByText("Negative (3)");
			cy.findByText("All scores (10)");
		}

		cy.findAllByText("More")
			.first()
			.click();
		cy.findByText("Delete").click();
		cy.findByText("Yes, delete").click();

		cy.findByText("0 lorem").should("not.exist");
		cy.findByText("Habit successfully deleted!");

		if (Cypress.env("device" === "desktop")) {
			cy.findByText("Positive (3)");
			cy.findByText("Neutral (3)");
			cy.findByText("Negative (3)");
			cy.findByText("All scores (9)");
		}
	});

	it("deleting habit error", () => {
		const errorMessage = "Couldn't delete habit.";

		cy.server();
		cy.route({
			method: "DELETE",
			url: "/api/v1/habit/6",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem");

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByText("Delete").click();
		cy.findByText("Yes, delete").click();

		cy.findByText("0 lorem").should("exist");
		cy.findByText(errorMessage);
	});

	it("inspecting habit details in modal", () => {
		const habitsResponse = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "fresh",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				progress_streak: 2,
				regress_streak: 0,
				is_trackable: true,
			},
			{
				id: 2,
				name: "Go to sleep",
				score: "neutral",
				strength: "developing",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				progress_streak: 0,
				regress_streak: 1,
				is_trackable: true,
			},
		];

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response: habitsResponse,
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit/1",
			status: 200,
			response: habitsResponse[0],
		});

		const chartResponse = [
			{
				day: "2019-01-01",
				vote: "progress",
			},
			{
				day: "2019-01-02",
				vote: "regress",
			},
			{
				day: "2019-01-03",
				vote: "regress",
			},
			{
				day: "2019-01-04",
				vote: "progress",
			},
			{
				day: "2019-01-05",
				vote: "progress",
			},
			{
				day: "2019-01-06",
				vote: "progress",
			},
			{
				day: "2019-01-07",
				vote: "progress",
			},
		];
		cy.route({
			method: "GET",
			url: "/api/v1/habit-chart/1?habitVoteChartDateRange=last_week",
			status: 200,
			response: chartResponse,
		});

		cy.route({
			method: "GET",
			url: "/api/v1/habit/2",
			status: 200,
			response: habitsResponse[1],
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit-chart/2?habitVoteChartDateRange=last_week",
			status: 500,
			response: [],
		});

		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=1",
			status: 200,
			response: [],
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.injectAxe();

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("positive");
			cy.findByDisplayValue("fresh");
			cy.findByDisplayValue("Watch The Office");
			cy.findByText("2019-01-01 00:00");
			cy.findByText("2019-02-01 00:00");
			cy.findByText("2 days progress streak");
			cy.findByDisplayValue("Last week");

			cy.checkA11y('div[role="dialog"]', {
				rules: {
					// Disabled due to a slight issue with the chart labels' text color
					"color-contrast": {
						enabled: false,
					},
				},
			});

			for (const {day, vote} of chartResponse) {
				cy.findByTitle(`${day} - ${vote}`);
			}

			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByText("More")
			.eq(1)
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral");
			cy.findByDisplayValue("developing");
			cy.findByDisplayValue("Go to sleep");
			cy.findByText("2019-01-01 00:00");
			cy.findByText("2019-02-01 00:00");
			cy.findByText("1 day regress streak");
			cy.findByDisplayValue("Last week");
			cy.findByText("Charts unavailable, please try again.");
		});

		cy.findByText("Fetching chart data failed.");
	});

	it("inspecting untracked habit in dialog", () => {
		const response = [
			{
				id: 1,
				name: "Watch The Office",
				score: "positive",
				strength: "fresh",
				created_at: "2019/01/01",
				updated_at: "2019/02/01",
				is_trackable: false,
			},
		];

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/habits",
			status: 200,
			response,
		});
		cy.route({
			method: "GET",
			url: "/api/v1/habit/1",
			status: 200,
			response: response[0],
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("Untracked");

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByRole("dialog").within(() => {
			cy.findByText("Habit preview");
			cy.findByDisplayValue("positive");
			cy.findByDisplayValue("fresh");
			cy.findByDisplayValue("Watch The Office");

			cy.findByText("Untracked");
			cy.findByPlaceholderText("Write something...");

			cy.findByText("Created at:");
			cy.findByText("2019-01-01 00:00");

			cy.findByText("Last update:");
			cy.findByText("2019-02-01 00:00");

			cy.findByText("Select date range:").should("not.exist");
			cy.findByText("Vote comments").should("not.exist");
		});
	});

	it("changing name", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		// "Save" flow
		cy.findByText("0 lorem xxx").should("not.exist");
		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Cancel");
		cy.findByText("Save").click();
		cy.findByText("Name updated successfully!");
		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

		cy.findByText("0 lorem xxx");
		cy.findByText("0 lorem").should("not.exist");

		// Enter flow
		cy.findByText("1 loremlorem yyy").should("not.exist");
		cy.findAllByText("More")
			.eq(1)
			.click();

		cy.findByDisplayValue("1 loremlorem").type(" yyy{enter}");
		cy.findByText("Save").should("not.exist");
		cy.findByText("Cancel").should("not.exist");
		cy.findAllByText("Name updated successfully!");
		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

		cy.findByText("1 loremlorem yyy");
		cy.findByText("1 loremlorem").should("not.exist");
	});

	it("cancel changing name", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" nono");
		cy.findByText("Cancel").click();
		cy.findByDisplayValue("0 lorem");

		cy.findByDisplayValue("0 lorem")
			.clear()
			.type("6 lorem");
		cy.findByText("Save").click();
		cy.findByText("Given habit already exists.");

		cy.findByText("Cancel").click();
		cy.findByDisplayValue("0 lorem");
	});

	it("changing name unique error", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findByText("0 lorem xxx").should("not.exist");
		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem")
			.clear()
			.type("9 lorem{enter}");

		cy.findByText("Given habit already exists.");

		cy.findByText("Save");
		cy.findByText("Cancel");
	});

	it("changing name error", () => {
		const errorMessage = "Error while chaning name.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/6",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByDisplayValue("0 lorem").type(" xxx");
		cy.findByText("Save").click();
		cy.findByText("Save");
		cy.findByText("Cancel");
		cy.findByText(errorMessage);

		cy.findByRole("dialog").within(() => cy.findByText("Close dialog").click({force: true}));

		cy.findByDisplayValue("0 lorem xxx").should("not.exist");
	});

	it("changing scores", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral").select("positive");
			cy.wait(100);
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByText("Habit score changed successfully!");

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 5);
			cy.findAllByText("neutral").should("have.length", 2);
			cy.findAllByText("negative").should("have.length", 3);
		});
	});

	it("changing scores error", () => {
		const errorMessage = "Error while chaning name.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/7",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("neutral").select("positive");
			cy.wait(100);
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByText("Habit score couldn't be changed.");

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);
		});
	});

	it("changing strengths", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("established").should("have.length", 4);
			cy.findAllByText("fresh").should("have.length", 3);
			cy.findAllByText("developing").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByDisplayValue("developing").select("established");
			cy.wait(100);
			cy.findByText("Close dialog").click({force: true});
		});

		cy.findAllByText("Habit strength changed successfully!");

		cy.get("ul").within(() => {
			cy.findAllByText("established").should("have.length", 5);
			cy.findAllByText("fresh").should("have.length", 3);
			cy.findAllByText("developing").should("have.length", 2);
		});
	});

	it("changing description", () => {
		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("xxx");

			cy.findByText("Save").click();
		});

		cy.findByText("Comment added successfully!");
	});

	it("changing description error", () => {
		const errorMessage = "Error while chaning description.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/7",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("xxx");

			cy.findByText("Save").click();
		});

		cy.findAllByText("Habit description couldn't be changed");
	});

	it("changing description inline error", () => {
		const errorMessage = "Error while chaning description.";

		cy.server();
		cy.route({
			method: "PATCH",
			url: "/api/v1/habit/7",
			status: 400,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
				message: errorMessage,
				argErrors: [
					{
						field: "description",
						validation: "max",
						message: "Too long description",
					},
				],
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.get("ul").within(() => {
			cy.findAllByText("positive").should("have.length", 4);
			cy.findAllByText("neutral").should("have.length", 3);
			cy.findAllByText("negative").should("have.length", 3);

			cy.findAllByText("More")
				.eq(1)
				.click();
		});

		cy.findByRole("dialog").within(() => {
			cy.findByPlaceholderText("Write something...")
				.clear()
				.type("xxx");

			cy.findByText("Save").click();
			cy.findByText("Too long description");
		});

		cy.findAllByText("Habit description couldn't be changed");
	});

	it("comments history request error", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=6",
			status: 500,
			response: {
				code: "E_INTERNAL_SERVER_ERROR",
			},
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByText("Vote comments");
		cy.findAllByText("Couldn't fetch vote comments.");
	});

	it("comments history empty list", () => {
		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=6",
			status: 200,
			response: [],
		});

		cy.login("dwight");
		cy.visit(HABITS_URL);

		cy.findAllByText("More")
			.first()
			.click();

		cy.findByText("Vote comments");
		cy.findByText("Future vote comments will appear here.");
	});

	it("comments history list", () => {
		cy.login("pam");
		cy.visit(HABITS_URL);

		cy.server();
		cy.route({
			method: "GET",
			url: "/api/v1/comments?habitId=36",
			status: 200,
			response: [
				{
					id: 35,
					vote: "regress",
					day: "2020-01-19T00:00:00.000Z",
					comment: "123",
					habit_id: 36,
				},
				{
					id: 34,
					vote: "plateau",
					day: "2020-01-18T00:00:00.000Z",
					comment: "124",
					habit_id: 36,
				},
				{
					id: 33,
					vote: "progress",
					day: "2020-01-17T00:00:00.000Z",
					comment: "125",
					habit_id: 36,
				},
			],
		});

		cy.findAllByText("More")
			.eq(5)
			.click();

		cy.findByText("Vote comments");

		cy.findByText("2020-01-19 (Sun)");
		cy.findByDisplayValue("123").should("be.disabled");

		cy.findByText("2020-01-18 (Sat)");
		cy.findByDisplayValue("124").should("be.disabled");

		cy.findByText("2020-01-17 (Fri)");
		cy.findByDisplayValue("125").should("be.disabled");

		cy.findByText("regress").click();

		cy.url().should("contain", "/calendar?preview_day=2020-01-19&highlighted_habit_id=36");
	});
});
