import React from "react";

import {Habit, HabitStrengthType, HabitStrengths} from "../models";
import * as UI from "../ui";

type HabitStrengthFilter = HabitStrengthType | "all-strengths";

const strengthFilterToFunction: {[key in HabitStrengthFilter]: (habit: Habit) => boolean} = {
	"all-strengths": () => true,
	established: habit => habit.strength === HabitStrengths.established,
	developing: habit => habit.strength === HabitStrengths.developing,
	fresh: habit => habit.strength === HabitStrengths.fresh,
};

export const useHabitStrengthFilter = (defaultValue: HabitStrengthFilter = "all-strengths") => {
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
		value: habitStrengthFilter,
		onChange: onHabitStrengthFilterChange,
		filterFunction: strengthFilterToFunction[habitStrengthFilter],
		reset: () => setHabitStrengthFilter(defaultValue),
	};
};

function isHabitStrengthFilter(value: string): value is HabitStrengthFilter {
	return [...Object.keys(HabitStrengths), "all-strengths"].includes(value);
}

interface IInput {
	filter: HabitStrengthFilter;
	value: HabitStrengthFilter;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const RadioButton: React.FC<IInput> = ({value, filter, ...props}) => (
	<UI.Radio
		name="habit-strength-filter"
		id={filter}
		type="radio"
		value={filter}
		checked={value === filter}
		{...props}
	/>
);

export const HabitStrengthFilters = {
	Established: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter={HabitStrengths.established} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor={HabitStrengths.established} {...props} />
		),
	},
	Developing: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter={HabitStrengths.developing} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor={HabitStrengths.developing} {...props} />
		),
	},
	Fresh: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter={HabitStrengths.fresh} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor={HabitStrengths.fresh} {...props} />
		),
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="all-strengths" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor="all-strengths" {...props} />
		),
	},
};
