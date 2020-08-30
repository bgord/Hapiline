const ace = require("@adonisjs/ace");

const {assertAccessDenied, assertInvalidSession} = require("../helpers/assert-errors");
const users = require("../fixtures/users.json");

const {test, trait, before, after} = use("Test/Suite")("Dashboard streak stats");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const User = use("User");
const Database = use("Database");

const timezone = "Europe/Warsaw";

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

before(async () => {
	await ace.call("seed", {}, {silent: true});
});

after(async () => {
	await ace.call("migration:refresh", {}, {silent: true});
});

const DASHBOARD_STREAK_STATS_URL = "/api/v1/dashboard-streak-stats";

test("auth", async ({client}) => {
	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.header("timezone", timezone)
		.end();
	assertInvalidSession(response);
});

test("is:(regular)", async ({client}) => {
	const admin = await User.find(users.admin.id);
	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.header("timezone", timezone)
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
		.header("timezone", timezone)
		.loginVia(jim)
		.end();
	assertAccessDenied(response);
});

test("full flow", async ({client, assert}) => {
	const pam = await User.find(users.pam.id);

	const response = await client
		.get(DASHBOARD_STREAK_STATS_URL)
		.header("timezone", timezone)
		.loginVia(pam)
		.end();

	assert.lengthOf(response.body.progress_streaks, 3);
	assert.lengthOf(response.body.regress_streaks, 4);
	assert.lengthOf(response.body.no_streak, 13);

	assert.hasAllKeys(response.body, ["progress_streaks", "regress_streaks", "no_streak"]);

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

	for (const habit of response.body.no_streak) {
		assert.hasAllKeys(habit, ["id", "name", "created_at", "has_vote_for_today"]);

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
		.header("timezone", timezone)
		.loginVia(pam)
		.end();

	for (let i = 0; i < response.body.progress_streaks.length - 1; i++) {
		const currentStreak = response.body.progress_streaks[i];

		// If we're looking on the first streak,
		// there's no previous one to compare with.
		if (i === 0) {
			assert.isAtLeast(currentStreak.progress_streak, 1);
		} else {
			const previousStreak = response.body.progress_streaks[i - 1];

			assert.isAtMost(currentStreak.progress_streak, previousStreak.progress_streak);

			if (
				currentStreak.progress_streak === previousStreak.progress_streak &&
				previousStreak.has_vote_for_today === true &&
				currentStreak.has_vote_for_today === false
			) {
				throw new Error("Streaks are not ordered by `has_vote_for_today` properly!");
			}
		}
	}

	for (let i = 0; i < response.body.regress_streaks.length - 1; i++) {
		const currentStreak = response.body.regress_streaks[i];

		// If we're looking on the first streak,
		// there's no previous one to compare with.
		if (i === 0) {
			assert.isAtLeast(currentStreak.regress_streak, 1);
		} else {
			const previousStreak = response.body.regress_streaks[i - 1];

			assert.isAtMost(currentStreak.regress_streak, previousStreak.regress_streak);

			if (
				currentStreak.regress_streak === previousStreak.regress_streak &&
				previousStreak.has_vote_for_today === true &&
				currentStreak.has_vote_for_today === false
			) {
				throw new Error("Streaks are not ordered by `has_vote_for_today` properly!");
			}
		}
	}
});
