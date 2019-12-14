import * as Async from "react-async";
import React from "react";

import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";

const HABIT_SCORE_TYPES = ["positive", "neutral", "negative"];

type Props = Partial<IHabit> & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitScoreSelect: React.FC<Props> = ({
	id,
	score,
	setHabitItem,
}) => {
	const [newHabitScore, setNewHabitScore] = React.useState<
		IHabit["score"] | undefined
	>(score);

	const [triggerSuccessNotification] = useNotification();
	const [triggerErrorNotification] = useNotification();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			triggerSuccessNotification({
				type: "success",
				message: "Habit score changed successfully!",
			});
			setHabitItem(habit);
		},
		onReject: () =>
			triggerErrorNotification({
				type: "error",
				message: "Habit score couldn't be changed.",
			}),
	});

	return (
		<select
			className="bg-gray-300 w-20 appearance-none cursor-pointer text-center"
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
