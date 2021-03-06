import React from "react";

import * as UI from "../ui";
import {useQueryParam} from "./useQueryParam";
import {HabitWithPossibleHabitVote} from "../models";

type HabitVoteFilterTypes = "unvoted" | "voted" | "all";

const filterToFunction: {
	[key in HabitVoteFilterTypes]: (
		habitWithPossibleHabitVote: HabitWithPossibleHabitVote,
	) => boolean;
} = {
	all: () => true,
	unvoted: ({vote}) => !vote?.vote,
	voted: ({vote}) => vote?.vote !== null && vote?.vote !== undefined,
};

export const useHabitVoteFilter = (
	defaultValue: HabitVoteFilterTypes = "all",
): {
	value: HabitVoteFilterTypes;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	filterFunction: (habitWithPossibleHabitVote: HabitWithPossibleHabitVote) => boolean;
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
function RadioButton({value, filter, ...props}: IInput) {
	return (
		<UI.Radio
			name="habit-vote-filter"
			id={filter}
			type="radio"
			value={filter}
			checked={value === filter}
			{...props}
		/>
	);
}

export const HabitVoteFilters = {
	Voted: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="voted" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="6" mr="12" htmlFor="voted" {...props} />
		),
	},
	Unvoted: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="unvoted" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="6" mr="12" htmlFor="unvoted" {...props} />
		),
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<RadioButton filter="all" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => (
			<UI.Label ml="6" mr="12" htmlFor="all" {...props} />
		),
	},
};
