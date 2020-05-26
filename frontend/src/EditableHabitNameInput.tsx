import * as Async from "react-async";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldState,
	useEditableFieldValue,
} from "./hooks/useEditableField";
import * as UI from "./ui";
import {HabitNameInput} from "./HabitNameInput";
import {DetailedHabit} from "./interfaces/index";
import {api} from "./services/api";
import {getRequestErrors} from "./selectors/getRequestErrors";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";

type EditableHabitNameInputProps = DetailedHabit & {
	setHabitItem: (habit: DetailedHabit) => void;
};

export const EditableHabitNameInput: React.FC<EditableHabitNameInputProps> = ({
	name,
	id,
	setHabitItem,
}) => {
	const field = useEditableFieldState();
	const getHabitsRequestState = useHabitsState();

	const triggerSuccessNotification = useSuccessToast();
	const triggerErrorNotification = useErrorToast();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			field.setIdle();
			triggerSuccessNotification("Name updated successfully!");
			setHabitItem(habit);
			getHabitsRequestState.reload();
		},
		onReject: _error => {
			const {getArgErrorMessage} = getRequestErrors(_error);
			const inlineNameErrorMessage = getArgErrorMessage("name");
			triggerErrorNotification(inlineNameErrorMessage || "Error while chaning name.");
		},
	});

	const [newHabitName, newHabitNameHelpers] = useEditableFieldValue(
		newName => editHabitRequestState.run(id, {name: newName}),
		name,
	);

	return (
		<UI.Row ml="12" crossAxis="end">
			<UI.Field width="100%" mr="12">
				<UI.Label htmlFor="habit_name">Habit name</UI.Label>
				<HabitNameInput
					onKeyDown={event => {
						if (event.keyCode === 13 && newHabitName !== name) {
							editHabitRequestState.run(id, {name: newHabitName});
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
