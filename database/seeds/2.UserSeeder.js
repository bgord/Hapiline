const Persona = use("Persona");
const ROLE_NAMES = use("ROLE_NAMES");
const Event = use("Event");
const Database = use("Database");

const userEntries = [
	{
		username: "admin",
		roleName: ROLE_NAMES.admin,
	},
	{
		username: "jim",
		roleName: ROLE_NAMES.regular,
	},
	{
		username: "dwight",
		roleName: ROLE_NAMES.regular,
	},
	{
		username: "michael",
		roleName: ROLE_NAMES.regular,
	},
	{
		username: "pam",
		roleName: ROLE_NAMES.regular,
	},
];

class UserSeeder {
	async run() {
		Event.fake();

		const roles = await Database.table("roles");
		const roleNameToId = roles.reduce(
			(result, role) => ({
				...result,
				[role.name]: role.id,
			}),
			{},
		);

		for (let {username, roleName} of userEntries) {
			const user = await Persona.register({
				email: `${username}@example.com`,
				password: "123456",
				password_confirmation: "123456",
			});
			await user.roles().attach([roleNameToId[roleName]]);
		}

		const emailVerificationTokens = await Database.table("tokens");
		for (let {token} of emailVerificationTokens) {
			await Persona.verifyEmail(token);
		}

		Event.restore();
	}
}

module.exports = UserSeeder;
