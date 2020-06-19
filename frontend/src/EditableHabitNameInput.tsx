import {queryCache, useMutation} from "react-query";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldState,
	useEditableFieldValue,
} from "./hooks/useEditableField";
import * as UI from "./ui";
import {HabitNameInput} from "./HabitNameInput";
import {DetailedHabit, DraftHabitPayload} from "./models";
import {api, AsyncReturnType} from "./services/api";
import {getRequestErrors} from "./selectors/getRequestErrors";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

export const EditableHabitNameInput: React.FC<DetailedHabit> = ({name, id}) => {
	const field = useEditableFieldState();
	const getHabitsRequestState = useHabitsState();

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const mediaQuery = useMediaQuery();

	const [updateHabitName] = useMutation<DetailedHabit, DraftHabitPayload>(api.habit.patch, {
		onSuccess: habit => {
			field.setIdle();
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

	const [newHabitName, newHabitNameHelpers] = useEditableFieldValue(
		newName => updateHabitName({id, name: newName}),
		name,
	);

	return (
		<UI.Row ml={mediaQuery === MEDIA_QUERY.default ? "12" : "0"} crossAxis="end" mt="24">
			<UI.Field width="100%" mr="12">
				<UI.Label htmlFor="habit_name">Habit name</UI.Label>
				<HabitNameInput
					onKeyDown={event => {
						if (event.keyCode === 13 && newHabitName !== name && newHabitName) {
							updateHabitName({id, name: newHabitName});
						}
					}}
					onFocus={field.setFocused}
					value={newHabitName ?? undefined}
					onChange={newHabitNameHelpers.onChange}
				/>
			</UI.Field>
			<SaveButton {...field} onClick={newHabitNameHelpers.onUpdate}>
				Save
			</SaveButton>
			<CancelButton {...field} onClick={newHabitNameHelpers.onClear}>
				Cancel
			</CancelButton>
		</UI.Row>
	);
};
