import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {getRequestErrors} from "./selectors/getRequestErrors";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";

type Props = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitNameInput: React.FC<Props> = ({name, id, setHabitItem}) => {
	const [isFocused, setIsFocused] = React.useState(false);
	const blurInput = () => setIsFocused(false);
	const focusInput = () => setIsFocused(true);

	const [newHabitName, setNewHabitName] = React.useState(() => name);

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			blurInput();
			triggerSuccessNotification("Name updated successfully!");
			setHabitItem(habit);
		},
		onReject: _error => {
			const {getArgErrorMessage} = getRequestErrors(_error);
			const inlineNameErrorMessage = getArgErrorMessage("name");
			triggerErrorNotification(inlineNameErrorMessage || "Error while chaning name.");
		},
	});

	const onSave = () => {
		if (newHabitName === name) blurInput();
		else editHabitRequestState.run(id, {name: newHabitName});
	};
	const onCancel = () => {
		blurInput();
		setNewHabitName(name);
	};

	const inputBgColor = isFocused ? "bg-gray-100" : "";

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
					onFocus={focusInput}
					className={`mr-4 p-1 pl-2 break-words pr-4 flex-grow focus:bg-gray-100 ${inputBgColor} border`}
					value={newHabitName}
					onChange={event => setNewHabitName(event.target.value)}
				/>
			</div>
			{isFocused && (
				<div className="flex">
					<BareButton onClick={onSave}>Save</BareButton>
					<BareButton onClick={onCancel}>Cancel</BareButton>
				</div>
			)}
		</div>
	);
};
