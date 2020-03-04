import React from "react";

import {HabitVote} from "../interfaces/IHabit";
import {Label, Radio} from "../ui";
import {useQueryParam} from "./useQueryParam";

type HabitVoteFilterTypes = "unvoted" | "voted" | "all";

const filterToFunction: {[key in HabitVoteFilterTypes]: (habitVote: HabitVote) => boolean} = {
	all: () => true,
	unvoted: ({vote}) => !vote,
	voted: ({vote}) => vote !== null && vote !== undefined,
};

export const useHabitVoteFilter = (
	defaultValue: HabitVoteFilterTypes = "all",
): {
	value: HabitVoteFilterTypes;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	filterFunction: (habitVote: HabitVote) => boolean;
	reset: VoidFunction;
} => {
	const [habitVoteFilterParam, updateHabitVoteFilterParam] = useQueryParam("habit_vote_filter");

	const habitVoteFilter = isFilter(habitVoteFilterParam) ? habitVoteFilterParam : defaultValue;

	function onHabitVoteFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isFilter(value)) updateHabitVoteFilterParam(value);
	}
	return {
		value: habitVoteFilter,
		onChange: onHabitVoteFilterChange,
		filterFunction: filterToFunction[habitVoteFilter],
		reset: () => updateHabitVoteFilterParam(defaultValue),
	};
};

function isFilter(value: string | undefined): value is HabitVoteFilterTypes {
	return value ? ["all", "voted", "unvoted"].includes(value) : false;
}

interface IInput {
	filter: HabitVoteFilterTypes;
	value: HabitVoteFilterTypes;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const RadioButton: React.FC<IInput> = ({value, filter, ...props}) => (
	<Radio
		name="habit-vote-filter"
		id={filter}
		type="radio"
		value={filter}
		checked={value === filter}
		{...props}
	/>
);

export const HabitVoteFilters = {
	Voted: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="voted" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<Label ml="6" mr="12" htmlFor="voted" {...props} />
		),
	},
	Unvoted: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="unvoted" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<Label ml="6" mr="12" htmlFor="unvoted" {...props} />
		),
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="all" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<Label ml="6" mr="12" htmlFor="all" {...props} />
		),
	},
};
