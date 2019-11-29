const User = use("User");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");

class RejectDeletedAccount {
	async handle({request, response}, next) {
		const {email} = request.only(["email"]);
		const user = await User.findBy("email", email);

		if (user && user.account_status === ACCOUNT_STATUSES.deleted) {
			return response.accessDenied();
		}

		return next();
	}
}

module.exports = RejectDeletedAccount;
