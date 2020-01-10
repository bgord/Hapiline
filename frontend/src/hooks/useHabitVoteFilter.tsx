import React from "react";

import {HabitVote} from "../interfaces/IHabit";

type HabitVoteFilterTypes = "unvoted" | "voted" | "all";

const filterToFunction: {[key in HabitVoteFilterTypes]: (habitVote: HabitVote) => boolean} = {
	all: () => true,
	unvoted: ({vote}) => !vote,
	voted: ({vote}) => vote !== null && vote !== undefined,
};

export const useHabitVoteFilter = (defaultValue: HabitVoteFilterTypes = "all") => {
	const [habitVoteFilter, setHabitVoteFilter] = React.useState<HabitVoteFilterTypes>(defaultValue);

	function onHabitVoteFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isFilter(value)) {
			setHabitVoteFilter(value);
		}
	}
	return {
		current: habitVoteFilter,
		onChange: onHabitVoteFilterChange,
		filterFunction: filterToFunction[habitVoteFilter],
		reset: () => setHabitVoteFilter(defaultValue),
	};
};

function isFilter(value: string): value is HabitVoteFilterTypes {
	return ["all", "voted", "unvoted"].includes(value);
}

interface IInput {
	filter: HabitVoteFilterTypes;
	current: HabitVoteFilterTypes;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: React.FC<IInput> = ({current, onChange, filter, ...props}) => {
	return (
		<input
			name="habitVoteFilter"
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
