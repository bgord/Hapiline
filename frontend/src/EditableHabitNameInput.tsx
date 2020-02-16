import * as Async from "react-async";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldState,
	useEditableFieldValue,
} from "./hooks/useEditableField";
import {Field} from "./ui/field/Field";
import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {Label} from "./ui/label/Label";
import {api} from "./services/api";
import {getRequestErrors} from "./selectors/getRequestErrors";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";

type EditableHabitNameInputProps = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitNameInput: React.FC<EditableHabitNameInputProps> = ({
	name,
	id,
	setHabitItem,
}) => {
	const field = useEditableFieldState();
	const getHabitsRequestState = useHabitsState();

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

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
		<div className="flex justify-between items-end w-full ml-4">
			<Field variant="column" style={{width: "100%", marginRight: "12px"}}>
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
				<Label htmlFor="habit_name">Habit name</Label>
			</Field>
			<SaveButton {...field} onClick={newHabitNameHelpers.onUpdate}>
				Save
			</SaveButton>
			<CancelButton {...field} onClick={newHabitNameHelpers.onClear} style={{marginLeft: "6px"}}>
				Cancel
			</CancelButton>
		</div>
	);
};
