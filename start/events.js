const Event = use("Event");
const Mail = use("Mail");
const MAIL_TEMPLATES = use("MAIL_TEMPLATES");
const Env = use("Env");

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
