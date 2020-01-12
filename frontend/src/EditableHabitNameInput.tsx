import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
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
	const [inputState, setInputState] = React.useState<"idle" | "focused">("idle");
	const getHabitsRequestState = useHabitsState();

	const [newHabitName, setNewHabitName] = React.useState(() => name);

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			setInputState("idle");
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

	const onSave = () => {
		if (newHabitName === name) setInputState("idle");
		else editHabitRequestState.run(id, {name: newHabitName});
	};
	const onCancel = () => {
		setInputState("idle");
		setNewHabitName(name);
	};

	const inputBgColor = inputState === "focused" ? "bg-gray-100" : "";

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
					onFocus={() => setInputState("focused")}
					className={`mr-4 p-1 pl-2 break-words pr-4 flex-grow focus:bg-gray-100 ${inputBgColor} border`}
					value={newHabitName}
					onChange={event => setNewHabitName(event.target.value)}
				/>
			</div>
			{inputState === "focused" && (
				<div className="flex">
					<BareButton onClick={onSave}>Save</BareButton>
					<BareButton onClick={onCancel}>Cancel</BareButton>
				</div>
			)}
		</div>
	);
};
