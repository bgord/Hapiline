import * as Async from "react-async";
import React from "react";

import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";

const HABIT_SCORE_TYPES = ["positive", "neutral", "negative"];

interface EditableHabitScoreSelectInterface extends IHabit {
	refreshList: VoidFunction;
}

export const EditableHabitScoreSelect: React.FC<EditableHabitScoreSelectInterface> = ({
	id,
	score,
	refreshList,
}) => {
	const [triggerSuccessNotification] = useNotification({
		type: "success",
		message: "Habit score changed successfully!",
	});
	const [triggerErrorNotification] = useNotification({
		type: "error",
		message: "Habit score couldn't be changed.",
	});

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: () => {
			triggerSuccessNotification();
			refreshList();
		},
		onReject: triggerErrorNotification,
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
			<option value="positive">positive</option>
			<option value="neutral">neutral</option>
			<option value="negative">negative</option>
		</select>
	);
};

function isHabitScore(value: string): value is IHabit["score"] {
	return HABIT_SCORE_TYPES.includes(value);
}
