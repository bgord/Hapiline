import {queryCache, useMutation} from "react-query";
import React from "react";

import {useEditableFieldValue} from "./hooks/useEditableField";
import * as UI from "./ui";
import {HabitNameInput} from "./HabitNameInput";
import {DetailedHabit, DraftHabitPayload} from "./models";
import {api, AsyncReturnType} from "./services/api";
import {getRequestErrors} from "./selectors/getRequestErrors";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";

export function EditableHabitNameInput({name, id}: DetailedHabit) {
	const getHabitsRequestState = useHabitsState();

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const [updateHabitName] = useMutation<DetailedHabit, DraftHabitPayload>(api.habit.patch, {
		onSuccess: habit => {
			triggerSuccessToast("Name updated successfully!");
			getHabitsRequestState.refetch();

			const _habit: AsyncReturnType<typeof api.habit.show> = habit;
			queryCache.setQueryData("single_habit", _habit);
		},
		onError: _error => {
			const {getArgErrorMessage} = getRequestErrors(_error as Error);
			const inlineNameErrorMessage = getArgErrorMessage("name");
			triggerErrorToast(inlineNameErrorMessage || "Error while chaning name.");
		},
	});

	const [newHabitName, newHabitNameHelpers] = useEditableFieldValue({
		updateFn: newName => updateHabitName({id, name: newName}),
		defaultValue: name,
	});

	const isHabitNamePristine = name === newHabitName;

	return (
		<UI.Row crossAxis="end" wrap={[, "wrap"]} mt="24">
			<UI.Field width="100%" mr="12">
				<UI.Label htmlFor="editable_habit_name">Habit name</UI.Label>
				<HabitNameInput
					id="editable_habit_name"
					onKeyDown={event => {
						if (event.keyCode === 13 && newHabitName !== name && newHabitName) {
							updateHabitName({id, name: newHabitName});
						}
					}}
					value={newHabitName ?? undefined}
					onChange={newHabitNameHelpers.onChange}
				/>
			</UI.Field>

			<UI.Button
				variant="primary"
				mr="3"
				mt="12"
				disabled={isHabitNamePristine || newHabitName === ""}
				onClick={newHabitNameHelpers.onUpdate}
			>
				Save
			</UI.Button>
			<UI.Button
				onClick={newHabitNameHelpers.onClear}
				variant="outlined"
				mr="6"
				mt="12"
				disabled={isHabitNamePristine}
			>
				Cancel
			</UI.Button>
		</UI.Row>
	);
}
