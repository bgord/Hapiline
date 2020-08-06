import React from "react";

import {Habit} from "../models";

export const useHabitSearch = (defaultValue = "") => {
	const [habitSearchPhrase, setHabitSearchPhrase] = React.useState(defaultValue);

	const habitSearchFilterFn = (habitName: Habit["name"]): boolean => {
		if (!habitSearchPhrase) return true;
		return habitName.toLowerCase().includes(habitSearchPhrase.toLowerCase());
	};

	const clearHabitSearchPhrase = () => setHabitSearchPhrase("");
	const onHabitSearchPhraseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHabitSearchPhrase(event.target.value);
	};

	return {
		value: habitSearchPhrase,
		onChange: onHabitSearchPhraseChange,
		filterFn: habitSearchFilterFn,
		clearPhrase: clearHabitSearchPhrase,
	};
};
