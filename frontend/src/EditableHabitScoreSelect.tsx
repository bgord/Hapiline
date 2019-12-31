import * as Async from "react-async";
import React from "react";

import {IHabit, scoreToBgColor} from "./interfaces/IHabit";
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

	const bgColor = scoreToBgColor[score];

	return (
		<select
			className={`${bgColor} w-20 appearance-none cursor-pointer text-center p-1`}
			style={{alignSelf: "end", justifySelf: "center"}}
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
		</select>
	);
};

function isHabitScore(value: string): value is IHabit["score"] {
	return HABIT_SCORE_TYPES.includes(value);
}
