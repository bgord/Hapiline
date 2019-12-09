import React from "react";
import * as Async from "react-async";

import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";

interface EditableHabitNameInputProps extends IHabit {
	currentlyditedHabitId?: IHabit["id"];
	setCurrentlyEditedHabitId: (id?: IHabit["id"]) => void;
}

const editHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	api
		.patch<IHabit>(`/habit-scoreboard-item/${id}`, payload)
		.then(response => response.data);

export const EditableHabitNameInput: React.FC<EditableHabitNameInputProps> = ({
	name,
	id,
	currentlyditedHabitId,
	setCurrentlyEditedHabitId,
}) => {
	const [habitName, setHabitName] = React.useState(() => name);
	const editHabitRequestState = Async.useAsync({
		deferFn: editHabitRequest,
		onResolve: () => setCurrentlyEditedHabitId(),
	});
	return (
		<>
			<HabitNameInput
				onFocus={() => {
					setCurrentlyEditedHabitId(id);
				}}
				className={`mx-4 p-1 break-words pr-4 flex-grow focus:bg-gray-100 ${
					currentlyditedHabitId === id ? "bg-gray-100" : ""
				}`}
				value={habitName}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setHabitName(event.target.value);
				}}
			/>
			{currentlyditedHabitId === id && (
				<div>
					<button
						onClick={() => {
							editHabitRequestState.run(id, {name: habitName});
						}}
						className="uppercase mr-4"
						type="button"
					>
						Save
					</button>
					<button
						onClick={() => {
							setCurrentlyEditedHabitId();
						}}
						className="uppercase"
						type="button"
					>
						Reset
					</button>
				</div>
			)}
		</>
	);
};
