import React from "react";

import {HabitVote} from "../interfaces/IHabit";
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
	current: HabitVoteFilterTypes;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	filterFunction: (habitVote: HabitVote) => boolean;
	reset: VoidFunction;
} => {
	const [habitVoteFilterParam, updateHabitVoteFilterParam] = useQueryParam("habit_vote_filter");

	React.useEffect(() => {
		if (!isFilter(habitVoteFilterParam)) updateHabitVoteFilterParam(defaultValue);
	}, [habitVoteFilterParam]);

	const habitVoteFilter = isFilter(habitVoteFilterParam) ? habitVoteFilterParam : defaultValue;

	function onHabitVoteFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isFilter(value)) updateHabitVoteFilterParam(value);
	}
	return {
		current: habitVoteFilter,
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
	current: HabitVoteFilterTypes;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: React.FC<IInput> = ({current, filter, ...props}) => {
	return (
		<input
			name="habit-vote-filter"
			id={filter}
			type="radio"
			value={filter}
			checked={current === filter}
			className="mr-1 ml-3"
			{...props}
		/>
	);
};

export const HabitVoteFilters = {
	Voted: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter="voted" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => <label htmlFor="voted" {...props} />,
	},
	Unvoted: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter="unvoted" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => <label htmlFor="unvoted" {...props} />,
	},
	All: {
		Input: (props: Omit<IInput, "filter"> & JSX.IntrinsicElements["input"]) => (
			<Input filter="all" {...props} />
		),
		Label: (props: JSX.IntrinsicElements["label"]) => <label htmlFor="all" {...props} />,
	},
};
