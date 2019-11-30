const Role = use("Role");
const Token = use("Token");
const Persona = use("Persona");
const ROLE_NAMES = use("ROLE_NAMES");
const Event = use("Event");

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

		const _roles = await Role.all();
		const roles = _roles.toJSON();

		const roleNameToId = roles.reduce((acc, role) => {
			acc[role.name] = role.id;
			return acc;
		}, {});

		for (let entry of userEntries) {
			const {username, roleName} = entry;

			const user = await Persona.register({
				email: `${username}@example.com`,
				password: "123456",
				password_confirmation: "123456",
			});

			await user.roles().attach([roleNameToId[roleName]]);
		}

		const _emailVerificationTokens = await Token.all();
		const emailVerificationTokens = _emailVerificationTokens.toJSON();

		await Promise.all(
			emailVerificationTokens.map(item => Persona.verifyEmail(item.token)),
		);

		Event.restore();
	}
}

module.exports = UserSeeder;
