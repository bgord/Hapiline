const ace = require("@adonisjs/ace");

const {assertAccessDenied, assertInvalidSession} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, beforeEach, afterEach} = use("Test/Suite")("Dashboard streak stats");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
const Database = use("Database");

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

beforeEach(async () => {
	await ace.call("seed", {}, {silent: true});
});

afterEach(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const DASHBOARD_STREAK_STATS_URL = "/api/v1/dashboard-streak-stats";

test("auth", async ({client}) => {
	const response = await client.get(DASHBOARD_STREAK_STATS_URL).end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.loginVia(admin)
		.end();
	assertAccessDenied(response);
});

test("account-status:(active)", async ({client}) => {
	const jim = await User.find(users.jim.id);
	jim.merge({
		account_status: ACCOUNT_STATUSES.pending,
	});
	await jim.save();

	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.loginVia(pam)
		.end();

	assert.lengthOf(response.body.progress_streaks, 3);
	assert.lengthOf(response.body.regress_streaks, 4);

	for (const habit of response.body.progress_streaks) {
		assert.hasAllKeys(habit, ["id", "name", "created_at", "progress_streak", "has_vote_for_today"]);

		const voteForHabitToday = await Database.first("vote")
			.from("habit_votes")
			.where({habit_id: habit.id, day: new Date()});

		if (!voteForHabitToday || voteForHabitToday.vote === null) {
			assert.equal(habit.has_vote_for_today, false);
		} else {
			assert.equal(habit.has_vote_for_today, true);
		}
	}

	for (const habit of response.body.regress_streaks) {
		assert.hasAllKeys(habit, ["id", "name", "created_at", "regress_streak", "has_vote_for_today"]);

		const voteForHabitToday = await Database.first("vote")
			.from("habit_votes")
			.where({habit_id: habit.id, day: new Date()});

		if (!voteForHabitToday || voteForHabitToday.vote === null) {
			assert.equal(habit.has_vote_for_today, false);
		} else {
			assert.equal(habit.has_vote_for_today, true);
		}
	}
});

test("streaks are returned in descending order", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.loginVia(pam)
		.end();

	for (let i = 0; i < response.body.progress_streaks.length - 1; i++) {
		if (i === 0) {
			assert.isAtLeast(response.body.progress_streaks[i].progress_streak, 1);
		} else {
			assert.isAtMost(
				response.body.progress_streaks[i].progress_streak,
				response.body.progress_streaks[i - 1].progress_streak,
			);
		}
	}

	for (let i = 0; i < response.body.regress_streaks.length - 1; i++) {
		if (i === 0) {
			assert.isAtLeast(response.body.regress_streaks[i].regress_streak, 1);
		} else {
			assert.isAtMost(
				response.body.regress_streaks[i].regress_streak,
				response.body.regress_streaks[i - 1].regress_streak,
			);
		}
	}
});
