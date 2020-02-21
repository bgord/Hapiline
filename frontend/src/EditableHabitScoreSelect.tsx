import * as Async from "react-async";
import React from "react";

import {Field} from "./ui/field/Field";
import {IHabit} from "./interfaces/IHabit";
import {Label} from "./ui/label/Label";
import {Select} from "./ui/select/Select";
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
		<Field>
			<Label htmlFor="habit_score">Score</Label>
			<Select
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
			</Select>
		</Field>
	);
};

function isHabitScore(value: string): value is IHabit["score"] {
	return HABIT_SCORE_TYPES.includes(value);
}
