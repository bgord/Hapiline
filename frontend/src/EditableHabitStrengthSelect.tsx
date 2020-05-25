import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {DetailedHabit, HabitStrengthType, isHabitStrength} from "./interfaces/index";
import {api} from "./services/api";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";

type EditableHabitStrengthSelectProps = DetailedHabit & {
	setHabitItem: (habit: DetailedHabit) => void;
};

export const EditableHabitStrengthSelect: React.FC<EditableHabitStrengthSelectProps> = ({
	id,
	strength,
	setHabitItem,
}) => {
	const [newHabitStrength, setNewHabitStrength] = React.useState<HabitStrengthType>(strength);

	const triggerSuccessNotification = useSuccessToast();
	const triggerErrorNotification = useErrorToast();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			triggerSuccessNotification("Habit strength changed successfully!");
			setHabitItem(habit);
		},
		onReject: () => triggerErrorNotification("Habit strength couldn't be changed."),
	});

	return (
		<UI.Field ml="12">
			<UI.Label htmlFor="habit_strength">Strength</UI.Label>
			<UI.Select
				id="habit_strength"
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
			</UI.Select>
		</UI.Field>
	);
};
