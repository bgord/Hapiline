const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");

class AccountController {
	async delete({response, auth}) {
		auth.user.merge({
			account_status: ACCOUNT_STATUSES.deleted,
		});

		await auth.user.save();

		return response.send();
	}
}

module.exports = AccountController;
