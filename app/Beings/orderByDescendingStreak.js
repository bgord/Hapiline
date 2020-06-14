function orderByDescendingStreak(key) {
	return (a, b) => {
		if (a[key] === b[key]) {
			return a.has_vote_for_today < b.has_vote_for_today ? -1 : 1;
		}
		return a[key] > b[key] ? -1 : 1;
	};
}

module.exports = {orderByDescendingStreak};
