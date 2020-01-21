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
		value: habitSearchPhrase,
		onChange: onHabitSearchPhraseChange,
		filterFn: habitSearchFilterFn,
		clearPhrase: clearHabitSearchPhrase,
	};
};

export const HabitSearchInput: React.FC<JSX.IntrinsicElements["input"]> = props => (
	<input className="field p-1 w-64" type="search" placeholder="Search for habits..." {...props} />
);
