function only(keysToKeep, object) {
	const filteredEntries = Object.entries(object).filter(([key]) => keysToKeep.includes(key));

	return Object.fromEntries(filteredEntries);
}

module.exports = only;
