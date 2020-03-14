import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";

const HABIT_SCORE_TYPES = ["positive", "neutral", "negative"];

type EditableHabitScoreSelectProps = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitScoreSelect: React.FC<EditableHabitScoreSelectProps> = ({
	id,
	score,
	setHabitItem,
}) => {
	const [newHabitScore, setNewHabitScore] = React.useState<IHabit["score"]>(score);

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

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

function isHabitScore(value: string): value is IHabit["score"] {
	return HABIT_SCORE_TYPES.includes(value);
}
