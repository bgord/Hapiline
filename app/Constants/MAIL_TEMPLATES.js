const MAIL_TEMPLATES = {
	registration: {
		template: "registration-email",
		subject: "Welcome to our service",
	},
	forgotPassword: {
		template: "forgot-password-email",
		subject: "Set a new password",
	},
	newEmailAddressVerification: {
		template: "new-email-address-verification",
		subject: "Confirm new email",
	},
};

module.exports = MAIL_TEMPLATES;
