const Hash = use("Hash");

class PasswordAuth {
	async handle({auth, request, response}, next) {
		const payloadPassword = request.only(["password"]).password;
		const userPassword = auth.user.password;

		const passwordMatches = await Hash.verify(payloadPassword, userPassword);

		if (passwordMatches) {
			return next();
		}
		return response.accessDenied();
	}
}

module.exports = PasswordAuth;
