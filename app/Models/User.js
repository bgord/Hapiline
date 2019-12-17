const Model = use("Model");

const Hash = use("Hash");

class User extends Model {
	static boot() {
		super.boot();

		this.addHook("beforeSave", async userInstance => {
			if (userInstance.dirty.password) {
				userInstance.password = await Hash.make(userInstance.password);
			}
		});
	}

	static get traits() {
		return [
			"@provider:Adonis/Acl/HasRole",
			"@provider:Adonis/Acl/HasPermission",
		];
	}

	static get hidden() {
		return ["password"];
	}

	/**
	 * A relationship on tokens is required for auth to
	 * work. Since features like `refreshTokens` or
	 * `rememberToken` will be saved inside the
	 * tokens table.
	 *
	 * @method tokens
	 *
	 * @return {Object}
	 */
	tokens() {
		return this.hasMany("App/Models/Token");
	}

	habits() {
		return this.hasMany("App/Models/Habit");
	}
}

module.exports = User;
