import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {IHabit} from "./interfaces/IHabit";
import {isHabitScore} from "./interfaces/index";
import {api} from "./services/api";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";

type EditableHabitScoreSelectProps = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitScoreSelect: React.FC<EditableHabitScoreSelectProps> = ({
	id,
	score,
	setHabitItem,
}) => {
	const [newHabitScore, setNewHabitScore] = React.useState<IHabit["score"]>(score);

	const triggerSuccessNotification = useSuccessToast();
	const triggerErrorNotification = useErrorToast();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			triggerSuccessNotification("Habit score changed successfully!");
			setHabitItem(habit);
		},
		onReject: () => triggerErrorNotification("Habit score couldn't be changed."),
	});

	return (
		<UI.Field>
			<UI.Label htmlFor="habit_score">Score</UI.Label>
			<UI.Select
				id="habit_score"
				value={newHabitScore}
				disabled={editHabitRequestState.isPending}
				onChange={event => {
					const {value} = event.target;
					if (isHabitScore(value) && value !== score) {
						setNewHabitScore(value);
						editHabitRequestState.run(id, {score: value});
					}
				}}
			>
				<option value="positive">positive</option>
				<option value="neutral">neutral</option>
				<option value="negative">negative</option>
			</UI.Select>
		</UI.Field>
	);
};
