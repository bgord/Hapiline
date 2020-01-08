import React from "react";

import {HabitStrengthType, IHabit, HABIT_STRENGTHS} from "../interfaces/IHabit";

type HabitStrengthFilter = HabitStrengthType | "all";

const strengthFilterToFunction: {[key in HabitStrengthFilter]: (habit: IHabit) => boolean} = {
	all: () => true,
	established: habit => habit.strength === HABIT_STRENGTHS.established,
	developing: habit => habit.strength === HABIT_STRENGTHS.developing,
	fresh: habit => habit.strength === HABIT_STRENGTHS.fresh,
};

export const useHabitStrengthFilter = (defaultValue: HabitStrengthFilter = "all") => {
	const [habitStrengthFilter, setHabitStrengthFilter] = React.useState<HabitStrengthFilter>(
		defaultValue,
	);

	function onHabitStrengthFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isHabitStrengthFilter(value)) {
			setHabitStrengthFilter(value);
		}
	}
	return {
		current: habitStrengthFilter,
		onChange: onHabitStrengthFilterChange,
		filterFunction: strengthFilterToFunction[habitStrengthFilter],
		setNewValue: setHabitStrengthFilter,
	};
};

function isHabitStrengthFilter(value: string): value is HabitStrengthFilter {
	return [...Object.keys(HABIT_STRENGTHS), "all"].includes(value);
}
