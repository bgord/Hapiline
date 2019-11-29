const VALIDATION_RULES = {
	user: {
		email: "required|email",
		password: "required|min:6",
		password_confirmation: "required|same:password|min:6",
		old_password: "required|different:password|min:6",
	},
	token: "required|max:255",
};

module.exports = VALIDATION_RULES;
