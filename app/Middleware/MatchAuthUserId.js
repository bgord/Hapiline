class MatchAuthUserId {
	async handle({auth, request, response}, next, args) {
		const [field] = args;
		const {[field]: providedUserId} = request.only([field]);

		if (field && providedUserId && providedUserId === auth.user.id) {
			return next();
		}

		return response.accessDenied();
	}
}

module.exports = MatchAuthUserId;
