const ACCOUNT_STATUSES = use("ACCOUNT_STATUSES");
const assert = require("assert");

class AccountStatus {
	async handle({response, auth}, next, demandedAccountStatuses) {
		const userAccountStatus = auth.user.account_status;

		demandedAccountStatuses.forEach(status => {
			assert.ok(Object.keys(ACCOUNT_STATUSES).includes(status));
		});

		if (demandedAccountStatuses.includes(userAccountStatus)) {
			return next();
		}
		return response.accessDenied();
	}
}

module.exports = AccountStatus;
