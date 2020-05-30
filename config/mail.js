const Env = use("Env");

module.exports = {
	/*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | Connection to be used for sending emails. Each connection needs to
  | define a driver too.
  |
  */
	connection: "smtp",

	/*
  |--------------------------------------------------------------------------
  | SMTP
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending emails via SMTP.
  |
  */
	smtp: {
		driver: "smtp",
		pool: true,
		port: Env.getOrFail("SMTP_PORT", 2525),
		host: Env.getOrFail("SMTP_HOST"),
		secure: false,
		auth: {
			user: Env.get("MAIL_USERNAME"),
			pass: Env.get("MAIL_PASSWORD"),
		},
		maxConnections: 5,
		maxMessages: 100,
		rateLimit: 10,
	},
};
