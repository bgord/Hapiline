const SANITIZATION_RULES = {
	user: {
		email: "trim",
	},
	token: "trim",
};

module.exports = SANITIZATION_RULES;
