import React from "react";

import {HabitStrengthType, IHabit, HABIT_STRENGTHS} from "../interfaces/IHabit";

type HabitStrengthFilter = HabitStrengthType | "all-strengths";

const strengthFilterToFunction: {[key in HabitStrengthFilter]: (habit: IHabit) => boolean} = {
	"all-strengths": () => true,
	established: habit => habit.strength === HABIT_STRENGTHS.established,
	developing: habit => habit.strength === HABIT_STRENGTHS.developing,
	fresh: habit => habit.strength === HABIT_STRENGTHS.fresh,
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
	return [...Object.keys(HABIT_STRENGTHS), "all-strengths"].includes(value);
}

interface IInput {
	filter: HabitStrengthFilter;
	value: HabitStrengthFilter;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: React.FC<IInput> = ({value, filter, ...props}) => (
	<input
		name="habit-strength-filter"
		id={filter}
		type="radio"
		value={filter}
		checked={value === filter}
		className="mr-1 ml-3"
		{...props}
	/>
);

export const HabitStrengthFilters = {
	Established: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter={HABIT_STRENGTHS.established} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<label htmlFor={HABIT_STRENGTHS.established} {...props} />
		),
	},
	Developing: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter={HABIT_STRENGTHS.developing} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<label htmlFor={HABIT_STRENGTHS.developing} {...props} />
		),
	},
	Fresh: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter={HABIT_STRENGTHS.fresh} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<label htmlFor={HABIT_STRENGTHS.fresh} {...props} />
		),
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter="all-strengths" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => <label htmlFor="all-strengths" {...props} />,
	},
};
