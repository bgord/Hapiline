const Persona = use("Persona");

class UserEmailController {
	async update({auth, request, response}) {
		const payload = request.only(["newEmail"]);
		const user = auth.user;

		await Persona.updateProfile(user, {email: payload.newEmail});

		return response.send(user);
	}
}

module.exports = UserEmailController;
