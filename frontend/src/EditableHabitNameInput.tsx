import * as Async from "react-async";
import React from "react";

import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";

interface EditableHabitNameProps {
	id: IHabit["id"];
	name: IHabit["name"];
	isHabitCurrentlyEdited: boolean;
	setHabitAsCurrentlyEdited: VoidFunction;
	clearCurrentlyEditedHabit: VoidFunction;
	newName: IHabit["name"] | undefined;
	setNewName: (name: IHabit["name"]) => void;
	refreshList: VoidFunction;
}

const editHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	api
		.patch<IHabit>(`/habit-scoreboard-item/${id}`, payload)
		.then(response => response.data);

export const EditableHabitNameInput: React.FC<EditableHabitNameProps> = ({
	id,
	name,
	isHabitCurrentlyEdited,
	setHabitAsCurrentlyEdited,
	clearCurrentlyEditedHabit,
	newName,
	setNewName,
	refreshList,
}) => {
	const editHabitRequestState = Async.useAsync({
		deferFn: editHabitRequest,
		onResolve: clearCurrentlyEditedHabit,
	});

	const backgroundColor = isHabitCurrentlyEdited ? "bg-gray-100" : "";

	return (
		<div className="flex  justify-between items-center">
			<HabitNameInput
				defaultValue={name}
				onFocus={setHabitAsCurrentlyEdited}
				className={`mx-4 p-1 break-words pr-4 flex-grow focus:bg-gray-100 ${backgroundColor}`}
				value={isHabitCurrentlyEdited ? newName : name}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					setNewName(event.target.value)
				}
			/>
			<div>
				{isHabitCurrentlyEdited && (
					<button
						onClick={() => {
							editHabitRequestState.run(id, {name: newName});
							refreshList();
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
							setNewName(name);
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
