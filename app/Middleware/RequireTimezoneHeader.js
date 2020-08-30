const {listTimeZones} = require("timezone-support");

class RequireTimezoneHeader {
	async handle({request, response}, next) {
		const timezones = listTimeZones();
		const timezone = request.header("timezone");

		if (!timezones.includes(timezone)) {
			return response.invalidTimezone();
		}

		return next();
	}
}

module.exports = RequireTimezoneHeader;
