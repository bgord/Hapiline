class SecurityHeaders {
	async handle({response}, next) {
		response.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
		response.header("X-Frame-Options", "SAMEORIGIN");
		response.header("X-Content-Type-Options", "nosniff");
		response.header("Referrer-Policy", "origin");
		response.header("Feature-Policy", "allow");
		return next();
	}
}

module.exports = SecurityHeaders;
