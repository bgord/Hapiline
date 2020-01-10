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
		reset: () => setHabitStrengthFilter(defaultValue),
	};
};

function isHabitStrengthFilter(value: string): value is HabitStrengthFilter {
	return [...Object.keys(HABIT_STRENGTHS), "all"].includes(value);
}

interface IInput {
	filter: HabitStrengthFilter;
	current: HabitStrengthFilter;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: React.FC<IInput> = ({current, onChange, filter, ...props}) => (
	<input
		name={filter}
		id={filter}
		type="radio"
		value={filter}
		checked={current === filter}
		onChange={onChange}
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
			<Input filter="all" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => <label htmlFor="all" {...props} />,
	},
};
