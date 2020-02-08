const Database = use("Database");

class AccountController {
	async delete({response}) {
		return response.send();
	}
}

module.exports = AccountController;
