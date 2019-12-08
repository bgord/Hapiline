import * as Async from "react-async";
import React from "react";

import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";

interface EditableHabitNameProps {
	item: IHabit;
	isHabitCurrentlyEdited: boolean;
	setHabitAsCurrentlyEdited: VoidFunction;
	clearCurrentlyEditedHabit: VoidFunction;
}

const editHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	api
		.patch<IHabit>(`/habit-scoreboard-item/${id}`, payload)
		.then(response => response.data);

export const EditableHabitNameInput: React.FC<EditableHabitNameProps> = ({
	item,
	isHabitCurrentlyEdited,
	setHabitAsCurrentlyEdited,
	clearCurrentlyEditedHabit,
}) => {
	const [newName, setNewName] = React.useState(item.name);

	const editHabitRequestState = Async.useAsync({
		deferFn: editHabitRequest,
		onResolve: clearCurrentlyEditedHabit,
	});

	const backgroundColor = isHabitCurrentlyEdited ? "bg-gray-100" : "";

	return (
		<div className="flex  justify-between items-center">
			<HabitNameInput
				onFocus={setHabitAsCurrentlyEdited}
				onBlur={() => setNewName(item.name)}
				className={`mx-4 p-1 break-words pr-4 flex-grow focus:bg-gray-100 ${backgroundColor}`}
				value={newName}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					setNewName(event.target.value)
				}
			/>
			<div>
				{isHabitCurrentlyEdited && (
					<button
						onClick={() => {
							editHabitRequestState.run(item.id, {name: newName});
						}}
						className="uppercase mr-4"
						type="button"
					>
						Save
					</button>
				)}
				{isHabitCurrentlyEdited && (
					<button
						onClick={() => {
							setNewName(item.name);
							clearCurrentlyEditedHabit();
						}}
						className="uppercase"
						type="button"
					>
						Reset
					</button>
				)}
			</div>
		</div>
	);
};
