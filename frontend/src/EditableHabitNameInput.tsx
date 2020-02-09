import * as Async from "react-async";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldState,
	useEditableFieldValue,
} from "./hooks/useEditableField";
import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
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

	const inputBgColor = field.state === "focused" ? "bg-gray-100" : "";

	return (
		<div className="flex justify-between items-end w-full ml-4">
			<div className="field-group w-full">
				<label className="field-label" htmlFor="email">
					Name
				</label>
				<HabitNameInput
					onKeyDown={event => {
						if (event.keyCode === 13 && newHabitName !== name) {
							editHabitRequestState.run(id, {name: newHabitName});
						}
					}}
					onFocus={field.setFocused}
					className={`mr-4 p-1 pl-2 break-words pr-4 flex-grow focus:bg-gray-100 ${inputBgColor} border`}
					value={newHabitName ?? undefined}
					onChange={newHabitNameHelpers.onChange}
				/>
			</div>
			<SaveButton {...field} onClick={newHabitNameHelpers.onUpdate}>
				Save
			</SaveButton>
			<CancelButton {...field} onClick={newHabitNameHelpers.onClear}>
				Cancel
			</CancelButton>
		</div>
	);
};
