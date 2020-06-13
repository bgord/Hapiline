import React from "react";

import * as UI from "../ui";

import {Habit, HabitScores, HabitScoreType} from "../models";

type HabitScoreFilter = HabitScoreType | "all-scores";

const scoreFilterToFunction: {
	[key in HabitScoreFilter]: (habit: Habit) => boolean;
} = {
	"all-scores": () => true,
	positive: habit => habit.score === HabitScores.positive,
	neutral: habit => habit.score === HabitScores.neutral,
	negative: habit => habit.score === HabitScores.negative,
};

function isHabitScoreFilter(value: string): value is HabitScoreFilter {
	return [...Object.keys(HabitScores), "all-scores"].includes(value);
}

export const useHabitScoreFilter = (defaultValue: HabitScoreFilter = "all-scores") => {
	const [habitScoreFilter, setHabitScoreFilter] = React.useState<HabitScoreFilter>(defaultValue);

	function onHabitScoreFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isHabitScoreFilter(value)) {
			setHabitScoreFilter(value);
		}
	}

	return {
		value: habitScoreFilter,
		onChange: onHabitScoreFilterChange,
		filterFunction: scoreFilterToFunction[habitScoreFilter],
		reset: () => setHabitScoreFilter(defaultValue),
	};
};

interface IInput {
	filter: HabitScoreFilter;
	value: HabitScoreFilter;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputButton: React.FC<IInput> = ({value, filter, ...props}) => (
	<UI.Radio
		name="habit-score-filter"
		id={filter}
		type="radio"
		value={filter}
		checked={value === filter}
		{...props}
	/>
);

export const HabitScoreFilters = {
	Positive: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<InputButton filter={HabitScores.positive} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor={HabitScores.positive} {...props} />
		),
	},
	Neutral: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<InputButton filter={HabitScores.neutral} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor={HabitScores.neutral} {...props} />
		),
	},
	Negative: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<InputButton filter={HabitScores.negative} {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor={HabitScores.negative} {...props} />
		),
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<InputButton filter="all-scores" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="12" htmlFor="all-scores" {...props} />
		),
	},
};
