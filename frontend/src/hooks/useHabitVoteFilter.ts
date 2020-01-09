import React from "react";

import {HabitVote} from "../interfaces/IHabit";

type FilterTypes = "all" | "unvoted" | "voted";

const filterToFunction: {[key in FilterTypes]: (habitVote: HabitVote) => boolean} = {
	all: () => true,
	unvoted: ({vote}) => !vote,
	voted: ({vote}) => vote !== null && vote !== undefined,
};

export const useHabitVoteFilter = (defaultValue: FilterTypes = "all") => {
	const [habitVoteFilter, setHabitVoteFilter] = React.useState<FilterTypes>(defaultValue);

	function onHabitVoteFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isFilter(value)) {
			setHabitVoteFilter(value);
		}
	}
	return {
		current: habitVoteFilter,
		onChange: onHabitVoteFilterChange,
		filterFunction: filterToFunction[habitVoteFilter],
		reset: () => setHabitVoteFilter(defaultValue),
	};
};

function isFilter(value: string): value is FilterTypes {
	return ["all", "voted", "unvoted"].includes(value);
}
