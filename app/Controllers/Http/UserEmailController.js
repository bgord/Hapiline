const Persona = use("Persona");

class UserEmailController {
	async update({auth, request}) {
		const payload = request.only(["newEmail"]);
		const user = auth.user;

		await Persona.updateProfile(user, {email: payload.newEmail});

		return user;
	}
}

module.exports = UserEmailController;
