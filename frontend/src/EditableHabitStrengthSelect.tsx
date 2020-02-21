import * as Async from "react-async";
import React from "react";

import {Field} from "./ui/field/Field";
import {IHabit} from "./interfaces/IHabit";
import {Label} from "./ui/label/Label";
import {Select} from "./ui/select/Select";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";

type EditableHabitStrengthSelectProps = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitStrengthSelect: React.FC<EditableHabitStrengthSelectProps> = ({
	id,
	strength,
	setHabitItem,
}) => {
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

	return (
		<Field style={{marginLeft: "12px"}}>
			<Label htmlFor="habit_strength">Strength</Label>
			<Select
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
			</Select>
		</Field>
	);
};

function isHabitStrength(value: string): value is IHabit["strength"] {
	const HABIT_SCORE_STRENGTHS = ["established", "developing", "fresh"];
	return HABIT_SCORE_STRENGTHS.includes(value);
}
