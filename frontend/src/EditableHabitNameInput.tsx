import React from "react";

import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";

interface EditableHabitNameProps {
	name: IHabit["name"];
	isHabitCurrentlyEdited: boolean;
	setHabitAsCurrentlyEdited: VoidFunction;
	clearCurrentlyEditedHabit: VoidFunction;
}

export const EditableHabitNameInput: React.FC<EditableHabitNameProps> = ({
	name,
	isHabitCurrentlyEdited,
	setHabitAsCurrentlyEdited,
	clearCurrentlyEditedHabit,
}) => {
	const [newName, setNewName] = React.useState(name);

	const backgroundColor = isHabitCurrentlyEdited ? "bg-gray-100" : "";

	return (
		<div className="flex  justify-between items-center">
			<HabitNameInput
				onFocus={setHabitAsCurrentlyEdited}
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
							console.log("savin");
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
							console.log("resettin");
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
