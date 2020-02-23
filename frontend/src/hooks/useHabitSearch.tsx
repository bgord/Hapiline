import React from "react";

import {Field} from "../ui/field/Field";
import {Input} from "../ui/input/Input";
import {Label} from "../ui/label/Label";
import {IHabit} from "../interfaces/IHabit";

export const useHabitSearch = (defaultValue = "") => {
	const [habitSearchPhrase, setHabitSearchPhrase] = React.useState(defaultValue);

	const habitSearchFilterFn = (habit: IHabit): boolean => {
		if (!habitSearchPhrase) return true;
		return habit.name.toLowerCase().includes(habitSearchPhrase.toLowerCase());
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

export const HabitSearchInput: React.FC<JSX.IntrinsicElements["input"]> = props => (
	<Field style={{width: "300px"}}>
		<Label htmlFor="habit_name">Habit name</Label>
		<Input id="habit_name" type="search" placeholder="Search for habits..." {...props} />
	</Field>
);
