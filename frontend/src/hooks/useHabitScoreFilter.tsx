import React from "react";

import {HABIT_SCORES, HabitScoreType, IHabit} from "../interfaces/IHabit";

type HabitScoreFilter = HabitScoreType | "all";

const scoreFilterToFunction: {[key in HabitScoreFilter]: (habit: IHabit) => boolean} = {
	all: () => true,
	positive: habit => habit.score === HABIT_SCORES.positive,
	neutral: habit => habit.score === HABIT_SCORES.neutral,
	negative: habit => habit.score === HABIT_SCORES.negative,
};

function isHabitScoreFilter(value: string): value is HabitScoreFilter {
	return [...Object.keys(HABIT_SCORES), "all"].includes(value);
}

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

interface IInput {
	filter: HabitScoreFilter;
	current: HabitScoreFilter;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: React.FC<IInput> = ({current, onChange, filter, ...props}) => {
	return (
		<input
			name="scoreFilter"
			id={filter}
			type="radio"
			value={filter}
			checked={current === filter}
			onChange={onChange}
			className="mr-1 ml-3"
			{...props}
		/>
	);
};

export const HabitScoreFilters = {
	Positive: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter={HABIT_SCORES.positive} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<label htmlFor={HABIT_SCORES.positive} {...props} />
		),
	},
	Neutral: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter={HABIT_SCORES.neutral} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<label htmlFor={HABIT_SCORES.neutral} {...props} />
		),
	},
	Negative: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter={HABIT_SCORES.negative} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<label htmlFor={HABIT_SCORES.negative} {...props} />
		),
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter="all" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => <label htmlFor="all" {...props} />,
	},
};
