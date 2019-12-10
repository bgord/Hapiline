import * as Async from "react-async";
import React from "react";

import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";

const HABIT_SCORE_TYPES = ["positive", "neutral", "negative"];

interface EditableHabitScoreSelectInterface extends IHabit {
	refreshList: VoidFunction;
}

const editHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	api
		.patch<IHabit>(`/habit-scoreboard-item/${id}`, payload)
		.then(response => response.data);

export const EditableHabitScoreSelect: React.FC<EditableHabitScoreSelectInterface> = ({
	id,
	score,
	refreshList,
}) => {
	const editHabitRequestState = Async.useAsync({
		deferFn: editHabitRequest,
		onResolve: refreshList,
	});

	return (
		<select
			className="bg-gray-300 w-20 pl-1 appearance-none cursor-pointer"
			value={score}
			disabled={editHabitRequestState.isPending}
			onChange={event => {
				const {value} = event.target;
				if (isHabitScore(value) && value !== score) {
					editHabitRequestState.run(id, {score: value});
				}
			}}
		>
			<option value="positive">Positive</option>
			<option value="neutral">Neutral</option>
			<option value="negative">Negative</option>
		</select>
	);
};

function isHabitScore(value: string): value is IHabit["score"] {
	return HABIT_SCORE_TYPES.includes(value);
}
