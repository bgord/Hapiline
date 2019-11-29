const Persona = use("Persona");

class ForgottenPasswordController {
	async update({request, response}) {
		const {token} = request.only(["token"]);
		const payload = request.only(["password", "password_confirmation"]);

		await Persona.updatePasswordByToken(token, payload);

		return response.status(204).send();
	}
}

module.exports = ForgottenPasswordController;
