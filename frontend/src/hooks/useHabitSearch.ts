import React from "react";

import {IHabit} from "../interfaces/IHabit";

export const useHabitSearch = (defaultValue = "") => {
	const [habitSearchPhrase, setHabitSearchPhrase] = React.useState(defaultValue);

	const habitSearchFilterFn = (habit: IHabit): boolean => {
		if (!habitSearchPhrase) return true;
		return habit.name.toLowerCase().includes(habitSearchPhrase.toLowerCase());
	};

	const clearHabitSearchPhrase = () => setHabitSearchPhrase(defaultValue);
	const onHabitSearchPhraseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHabitSearchPhrase(event.target.value);
	};

	return {
		phrase: habitSearchPhrase,
		onChange: onHabitSearchPhraseChange,
		filterFn: habitSearchFilterFn,
		clearPhrase: clearHabitSearchPhrase,
	};
};
