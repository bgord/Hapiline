const getTasks = commands => commands.join(" && ");

module.exports = {
	hooks: {
		"pre-commit": getTasks(["npm run prettify:staged", "npm run lint"]),
		"pre-push": getTasks(["npm run lint", "ENV=test ./npm.sh run api:test"]),
	},
};
