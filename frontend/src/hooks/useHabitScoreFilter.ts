import React from "react";

import {HABIT_SCORES, HabitScoreType, IHabit} from "../interfaces/IHabit";

type HabitScoreFilter = HabitScoreType | "all";

const scoreFilterToFunction: {[key in HabitScoreFilter]: (habit: IHabit) => boolean} = {
	all: () => true,
	positive: habit => habit.score === HABIT_SCORES.positive,
	neutral: habit => habit.score === HABIT_SCORES.neutral,
	negative: habit => habit.score === HABIT_SCORES.negative,
};

export const useHabitScoreFilter = (defaultValue: HabitScoreFilter = "all") => {
	const [habitScoreFilter, setHabitScoreFilter] = React.useState<HabitScoreFilter>(defaultValue);

	function onHabitScoreFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isHabitScoreFilter(value)) {
			setHabitScoreFilter(value);
		}
	}

	return {
		current: habitScoreFilter,
		onChange: onHabitScoreFilterChange,
		filterFunction: scoreFilterToFunction[habitScoreFilter],
		reset: () => setHabitScoreFilter(defaultValue),
	};
};

function isHabitScoreFilter(value: string): value is HabitScoreFilter {
	return [...Object.keys(HABIT_SCORES), "all"].includes(value);
}
