const Persona = use("Persona");

class EmailVerificationController {
	async update({request, response}) {
		const payload = request.only(["token"]);
		await Persona.verifyEmail(payload.token);
		return response.send();
	}
}

module.exports = EmailVerificationController;
