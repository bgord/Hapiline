import {queryCache, useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {DetailedHabit, HabitStrengthType, isHabitStrength, DraftHabitPayload} from "./models";
import {api, AsyncReturnType} from "./services/api";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";

export const EditableHabitStrengthSelect: React.FC<DetailedHabit> = ({id, strength}) => {
	const [newHabitStrength, setNewHabitStrength] = React.useState<HabitStrengthType>(strength);

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const [updateHabitStrength, updateHabitStrengthRequestState] = useMutation<
		DetailedHabit,
		DraftHabitPayload
	>(api.habit.patch, {
		onSuccess: habit => {
			triggerSuccessToast("Habit strength changed successfully!");

			const _habit: AsyncReturnType<typeof api.habit.show> = habit;
			queryCache.setQueryData("single_habit", _habit);
		},
		onError: () => triggerErrorToast("Habit strength couldn't be changed."),
	});

	return (
		<UI.Field mt="24">
			<UI.Label htmlFor="habit_strength">Strength</UI.Label>
			<UI.Select
				id="habit_strength"
				value={newHabitStrength}
				disabled={updateHabitStrengthRequestState.status === "loading"}
				onChange={event => {
					const {value} = event.target;
					if (isHabitStrength(value) && value !== strength) {
						setNewHabitStrength(value);
						updateHabitStrength({id, strength: value});
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
