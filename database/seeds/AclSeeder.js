const ROLE_NAMES = use("ROLE_NAMES");
const Role = use("Role");

const roleEntries = [
	{
		name: ROLE_NAMES.admin,
		slug: ROLE_NAMES.admin,
		description: "Admin role",
	},
	{
		name: ROLE_NAMES.regular,
		slug: ROLE_NAMES.regular,
		description: "Regular user role",
	},
];

class AclSeeder {
	async run() {
		await Promise.all(roleEntries.map(entry => Role.create(entry)));
	}
}

module.exports = AclSeeder;
