import React from "react";

import {IHabit} from "../interfaces/IHabit";

export const useHabitSearch = (defaultValue = "") => {
	const [habitSearchPhrase, setHabitSearchPhrase] = React.useState(defaultValue);

	const habitSearchFilterFn = (habit: IHabit): boolean => {
		if (!habitSearchPhrase) return true;
		return habit.name.toLowerCase().includes(habitSearchPhrase.toLowerCase());
	};

	const clearHabitSearchPhrase = () => setHabitSearchPhrase(defaultValue);

	return {habitSearchPhrase, setHabitSearchPhrase, habitSearchFilterFn, clearHabitSearchPhrase};
};
