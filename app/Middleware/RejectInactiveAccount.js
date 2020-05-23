const User = use("User");
const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");

// This middleware is very similar to `account-status` middleware.

// The difference is that `account-status` check the `account_status`
// of an account that is already authenticated.

// This middleware checks the `account_status` of an account that is
// about to be authenticated (queried by `email`).

class RejectInactiveAccount {
	async handle({request, response}, next) {
		const {email} = request.only(["email"]);
		const user = await User.findBy("email", email);

		if (
			user &&
			[ACCOUNT_STATUSES.pending, ACCOUNT_STATUSES.deleted].includes(user.account_status)
		) {
			return response.accessDenied();
		}

		return next();
	}
}

module.exports = RejectInactiveAccount;
