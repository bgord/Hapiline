function skip(keysToSkip, object) {
	const filteredEntries = Object.entries(object).filter(([key]) => !keysToSkip.includes(key));

	return Object.fromEntries(filteredEntries);
}

module.exports = skip;
