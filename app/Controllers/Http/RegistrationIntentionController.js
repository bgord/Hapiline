const Persona = use("Persona");
const Role = use("Role");
const ROLE_NAMES = use("ROLE_NAMES");

class RegistrationIntentionController {
	async store({request, response}) {
		const payload = request.only(["email", "password", "password_confirmation"]);

		const user = await Persona.register(payload);

		const regularRole = await Role.findBy("name", ROLE_NAMES.regular);
		await user.roles().attach([regularRole.id]);

		return response.status(200).send();
	}
}

module.exports = RegistrationIntentionController;
