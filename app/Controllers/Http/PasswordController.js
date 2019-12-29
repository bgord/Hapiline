const Persona = use("Persona");

class PasswordController {
	async update({request, response, auth}) {
		const payload = request.only(["old_password", "password", "password_confirmation"]);
		const user = auth.user;
		await Persona.updatePassword(user, payload);
		return response.status(204).send();
	}
}

module.exports = PasswordController;
