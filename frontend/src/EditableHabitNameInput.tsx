import * as Async from "react-async";
import React from "react";

import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";

export const EditableHabitNameInput: React.FC<Partial<IHabit>> = ({
	name,
	id,
}) => {
	const [isFocused, setIsFocused] = React.useState(false);
	const blurInput = () => setIsFocused(false);
	const focusInput = () => setIsFocused(true);

	const [newHabitName, setNewHabitName] = React.useState(() => name);
	const [triggerSuccessNotification] = useNotification({
		type: "success",
		message: "Name updated successfully!",
	});
	const [triggerErrorNotification] = useNotification({
		type: "error",
		message: "Error while chaning name.",
	});
	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: () => {
			blurInput();
			triggerSuccessNotification();
		},
		onReject: triggerErrorNotification,
	});

	const inputBgColor = isFocused ? "bg-gray-100" : "";

	return (
		<div className="flex justify-between items-end w-full">
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
					<button
						onClick={() => {
							if (newHabitName === name) blurInput();
							else editHabitRequestState.run(id, {name: newHabitName});
						}}
						className="uppercase mr-4"
						type="button"
					>
						Save
					</button>
					<button onClick={blurInput} className="uppercase" type="button">
						Cancel
					</button>
				</div>
			)}
		</div>
	);
};
