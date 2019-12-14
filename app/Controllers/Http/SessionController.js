const Persona = use("Persona");

class SessionController {
	async store({request, response, auth}) {
		const payload = request.only(["email", "password"]);
		try {
			const user = await Persona.verify({
				uid: payload.email,
				password: payload.password,
			});
			await auth.login(user);
			return response.send(user);
		} catch (error) {
			return response.invalidCredentials();
		}
	}

	async destroy({auth, response}) {
		await auth.logout();
		return response.send();
	}
}

module.exports = SessionController;
