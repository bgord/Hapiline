const Env = use("Env");

module.exports = {
	connection: "pg",
	pg: {
		client: "pg",
		connection: {
			host: Env.getOrFail("DB_HOST", "localhost"),
			port: Env.getOrFail("DB_PORT", ""),
			user: Env.getOrFail("DB_USER", "root"),
			password: Env.getOrFail("DB_PASSWORD", ""),
			database: Env.getOrFail("DB_DATABASE", "adonis"),
		},
		debug: Env.get("DB_DEBUG", false),
	},
};
