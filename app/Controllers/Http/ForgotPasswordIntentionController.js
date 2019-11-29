const Persona = use("Persona");

class ForgotPasswordIntentionController {
	async store({request, response}) {
		const payload = request.only(["email"]);
		try {
			await Persona.forgotPassword(payload.email);
		} catch (e) {
			console.error(e);
		} finally {
			return response.status(204).send();
		}
	}
}

module.exports = ForgotPasswordIntentionController;
