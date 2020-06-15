const Route = use("Route");
const Helpers = use("Helpers");
const Drive = use("Drive");
const Env = use("Env");
const execa = require("execa");

Route.group(() => {
	Route.post("/login", "SessionController.store")
		.validator("StoreSession")
		.middleware("reject-inactive-account");

	Route.post("/register", "RegistrationIntentionController.store").validator(
		"StoreRegistrationIntention",
	);

	Route.post("/verify-email", "EmailVerificationController.update").validator(
		"UpdateEmailVerification",
	);

	Route.post("/forgot-password", "ForgotPasswordIntentionController.store").validator(
		"StoreForgotPasswordIntention",
	);

	Route.post("/new-password", "ForgottenPasswordController.update").validator(
		"UpdateForgottenPassword",
	);
})
	.prefix("api/v1")
	.middleware("guest");

Route.group(() => {
	Route.post("/logout", "SessionController.destroy");

	Route.get("/me", ({response, auth}) =>
		response.send({email: auth.user.email, id: auth.user.id, created_at: auth.user.created_at}),
	);

	Route.patch("/update-password", "PasswordController.update")
		.validator("UpdatePassword")
		.middleware("account-status:active");

	Route.post("/change-email", "UserEmailController.update")
		.validator("UpdateUserEmail")
		.middleware(["password-auth", "account-status:active"]);
})
	.prefix("api/v1")
	.middleware("auth");

Route.get("/healthcheck", () => ({
	greeting: "Hello world in JSON",
}));

Route.get("/app", async ({auth}) => {
	const user = await auth.getUser();
	return {message: `Hello from the inside, ${user.toJSON().email}.`};
}).middleware("auth");

Route.post("/test/db/seed", async ({response}) => {
	const env = Env.get("NODE_ENV");
	if (env !== "production") {
		await execa("node", ["ace", "migration:refresh"]);
		await execa("node", ["ace", "seed"]);
	}
	return response.send();
});

Route.post("/api/v1/habit", "HabitsController.store")
	.middleware(["auth", `is:(regular)`, `account-status:active`])
	.validator("StoreHabit")
	.middleware("match-auth-user-id:user_id");

Route.get("/api/v1/habits", "HabitsController.index").middleware([
	"auth",
	`is:(regular)`,
	`account-status:active`,
]);

Route.delete("/api/v1/habit/:id", "HabitsController.delete").middleware([
	"auth",
	"is:(regular)",
	"account-status:active",
	"params-resource-exists:habits,id",
]);

Route.patch("/api/v1/habit/:id", "HabitsController.update")
	.middleware(["auth", "is:(regular)", "account-status:active", "params-resource-exists:habits,id"])
	.validator("UpdateHabit");

Route.get("/api/v1/habit/:id", "HabitsController.show").middleware([
	"auth",
	"is:(regular)",
	"account-status:active",
]);

Route.patch("/api/v1/reorder-habits", "HabitOrderController.update")
	.middleware(["auth", "is:(regular)", "account-status:active"])
	.validator("ReorderHabits")
	.middleware(["check-habit-ids", "validate-indexes-order"]);

Route.get("/api/v1/month", "MonthController.show")
	.middleware(["auth", "is:(regular)", "account-status:active"])
	.validator("ShowMonth");

Route.post("/api/v1/vote", "VoteController.update")
	.middleware(["auth", "is:(regular)", "account-status:active"])
	.validator("UpdateVote");

Route.get("/api/v1/day-votes", "HabitVotesForDayController.show")
	.middleware(["auth", "is:(regular)", "account-status:active"])
	.validator("ShowHabitVotesForDay");

Route.get("/api/v1/habit-chart/:id", "HabitChartsController.show")
	.middleware(["auth", "is:(regular)", "account-status:active", "params-resource-exists:habits,id"])
	.validator("ShowHabitChart");

Route.patch("/api/v1/vote/:id/comment", "VoteCommentController.update")
	.middleware([
		"auth",
		"is:(regular)",
		"account-status:active",
		"params-resource-exists:habit_votes,id",
	])
	.validator("UpdateVoteComment");

Route.get("/api/v1/comments", "VoteCommentController.index")
	.middleware(["auth", "is:(regular)", "account-status:active"])
	.validator("IndexVoteComment");

Route.get("/api/v1/dashboard-stats", "DashboardStatsController.index").middleware([
	"auth",
	"is:(regular)",
	"account-status:active",
]);

Route.get("/api/v1/notifications", "NotificationsController.index").middleware([
	"auth",
	"is:(regular)",
	"account-status:active",
]);

Route.patch("/api/v1/notification/:id", "NotificationsController.update")
	.middleware([
		"auth",
		"is:(regular)",
		"account-status:active",
		"params-resource-exists:notifications,id",
	])
	.validator("UpdateNotification");

Route.get("/api/v1/dashboard-streak-stats", "DashboardStreakStatsController.index").middleware([
	"auth",
	"is:(regular)",
	"account-status:active",
]);

Route.delete("/api/v1/account", "AccountController.delete").middleware([
	"auth",
	"is:(regular)",
	"account-status:active",
]);

Route.get("/api/v1/journals/:day", "JournalController.index")
	.middleware(["auth", `is:(regular)`, `account-status:active`])
	.validator("ShowJournal");

Route.get("*", async ({request, response}) => {
	const resourcePath = request.url();
	if (resourcePath === "/") {
		return response.download(Helpers.publicPath("index.html"));
	}
	const pathSegments = resourcePath.split("/");
	const filename = pathSegments[pathSegments.length - 1];

	const resourcePathExists = await Drive.exists(`../public/${filename}`);

	return response.download(
		Helpers.publicPath(resourcePathExists && filename !== "" ? filename : "index.html"),
	);
});
