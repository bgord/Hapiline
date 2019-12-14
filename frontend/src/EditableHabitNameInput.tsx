import * as Async from "react-async";
import React from "react";

import {ApiError, api} from "./services/api";
import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {useNotification} from "./contexts/notifications-context";

type Props = IHabit & {
	setHabitItem: (habit: IHabit) => void;
};

export const EditableHabitNameInput: React.FC<Props> = ({
	name,
	id,
	setHabitItem,
}) => {
	const [isFocused, setIsFocused] = React.useState(false);
	const blurInput = () => setIsFocused(false);
	const focusInput = () => setIsFocused(true);

	const [newHabitName, setNewHabitName] = React.useState(() => name);

	const [triggerSuccessNotification] = useNotification();
	const [triggerErrorNotification] = useNotification();

	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: habit => {
			blurInput();
			triggerSuccessNotification({
				type: "success",
				message: "Name updated successfully!",
			});
			setHabitItem(habit);
		},
		onReject: _error => {
			const error = _error as ApiError;

			const inlineNameError = error?.response?.data.argErrors.find(
				argError => argError.field === "name",
			)?.message;

			triggerErrorNotification({
				type: "error",
				message: inlineNameError || "Error while chaning name.",
			});
		},
	});

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
					<button
						onClick={() => {
							blurInput();
							setNewHabitName(name);
						}}
						className="uppercase"
						type="button"
					>
						Cancel
					</button>
				</div>
			)}
		</div>
	);
};
