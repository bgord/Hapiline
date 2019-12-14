/* eslint-disable no-unsafe-finally, no-console */

const Persona = use("Persona");

class ForgotPasswordIntentionController {
	async store({request, response}) {
		const payload = request.only(["email"]);
		try {
			await Persona.forgotPassword(payload.email);
		} catch (error) {
			console.error(error);
		} finally {
			return response.status(204).send();
		}
	}
}

module.exports = ForgotPasswordIntentionController;
