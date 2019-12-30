import * as Async from "react-async";
import React from "react";

import {IHabit, strengthToBgColor} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";

type Props = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitStrengthSelect: React.FC<Props> = ({id, strength, setHabitItem}) => {
	const [newHabitStrength, setNewHabitStrength] = React.useState<IHabit["strength"]>(strength);

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			triggerSuccessNotification("Habit strength changed successfully!");
			setHabitItem(habit);
		},
		onReject: () => triggerErrorNotification("Habit strength couldn't be changed."),
	});

	const bgColor = strengthToBgColor[strength];

	return (
		<select
			className={`${bgColor} w-32 appearance-none cursor-pointer text-center p-1`}
			style={{alignSelf: "end", justifySelf: "center"}}
			value={newHabitStrength}
			disabled={editHabitRequestState.isPending}
			onChange={event => {
				const {value} = event.target;
				if (isHabitStrength(value) && value !== strength) {
					setNewHabitStrength(value);
					editHabitRequestState.run(id, {strength: value});
				}
			}}
		>
			<option value="established">established</option>
			<option value="developing">developing</option>
			<option value="fresh">fresh</option>
		</select>
	);
};

function isHabitStrength(value: string): value is IHabit["strength"] {
	const HABIT_SCORE_STRENGTHS = ["established", "developing", "fresh"];
	return HABIT_SCORE_STRENGTHS.includes(value);
}
