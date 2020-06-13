import {queryCache, useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {DetailedHabit, HabitScoreType, isHabitScore, DraftHabitPayload} from "./models";
import {api, AsyncReturnType} from "./services/api";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";

export const EditableHabitScoreSelect: React.FC<DetailedHabit> = ({id, score}) => {
	const [newHabitScore, setNewHabitScore] = React.useState<HabitScoreType>(score);

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const [updateHabitScore, updateHabitScoreRequestState] = useMutation<
		DetailedHabit,
		DraftHabitPayload
	>(api.habit.patch, {
		onSuccess: habit => {
			triggerSuccessToast("Habit score changed successfully!");

			const _habit: AsyncReturnType<typeof api.habit.show> = habit;
			queryCache.setQueryData("single_habit", _habit);
		},
		onError: () => triggerErrorToast("Habit score couldn't be changed."),
	});

	return (
		<UI.Field>
			<UI.Label htmlFor="habit_score">Score</UI.Label>
			<UI.Select
				id="habit_score"
				value={newHabitScore}
				disabled={updateHabitScoreRequestState.status === "loading"}
				onChange={event => {
					const {value} = event.target;
					if (isHabitScore(value) && value !== score) {
						setNewHabitScore(value);
						updateHabitScore({id, score: value});
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
