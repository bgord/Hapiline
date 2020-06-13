const Event = use("Event");
const Mail = use("Mail");
const MAIL_TEMPLATES = use("MAIL_TEMPLATES");
const Env = use("Env");
const NOTIFICATION_TYPES = use("NOTIFICATION_TYPES");
const NOTIFICATION_STATUSES = use("NOTIFICATION_STATUSES");
const Notification = use("Notification");
const {HabitVotesGetter} = require("../app/Beings/HabitVotesGetter");
const {VotesStreakCalculator} = require("../app/Beings/VotesStreakCalculator");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");

const HOST_PATH = Env.get("HOST_PATH");

Event.on("user::created", async ({user, token}) => {
	const {email} = user.toJSON();

	await Mail.send(
		MAIL_TEMPLATES.registration.template,
		{link: `${HOST_PATH}/verify-email/${encodeURIComponent(token)}`},
		message => {
			message.subject(MAIL_TEMPLATES.registration.subject);
			message.from(Env.get("MAIL_FROM"));
			message.to(email);
		},
	);
});

Event.on("forgot::password", async ({user, token}) => {
	const {email} = user.toJSON();

	await Mail.send(
		MAIL_TEMPLATES.forgotPassword.template,
		{link: `${HOST_PATH}/new-password/${encodeURIComponent(token)}`},
		message => {
			message.subject(MAIL_TEMPLATES.forgotPassword.subject);
			message.from(Env.get("MAIL_FROM"));
			message.to(email);
		},
	);
});

Event.on("email::changed", async ({user, token}) => {
	const {email} = user.toJSON();

	await Mail.send(
		MAIL_TEMPLATES.newEmailAddressVerification.template,
		{link: `${HOST_PATH}/verify-email/${encodeURIComponent(token)}`},
		message => {
			message.subject(MAIL_TEMPLATES.newEmailAddressVerification.subject);
			message.from(Env.get("MAIL_FROM"));
			message.to(email);
		},
	);
});

Event.on("vote::updated", async ({vote, habit}) => {
	if (vote.vote !== HABIT_VOTE_TYPES.progress) return;

	const habitVotesGetter = new HabitVotesGetter(habit);
	const allHabitVotes = await habitVotesGetter.get({from: new Date(habit.created_at)});

	const streaksCalculator = new VotesStreakCalculator(allHabitVotes);
	const progressStreak = streaksCalculator.calculate(HABIT_VOTE_TYPES.progress);

	const milestones = [5, 10, 15, 25, 50, 100];

	if (milestones.includes(progressStreak)) {
		const notificationPayload = {
			content: `You have ${progressStreak} progress votes for '${habit.name}'!`,
			type: NOTIFICATION_TYPES.regular,
			status: NOTIFICATION_STATUSES.unread,
			user_id: habit.user_id,
		};

		await Notification.create(notificationPayload);
	}
});
