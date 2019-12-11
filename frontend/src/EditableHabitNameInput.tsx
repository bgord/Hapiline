import * as Async from "react-async";
import React from "react";

import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";

interface EditableHabitNameInputProps extends IHabit {
	currentlyEditedHabitId?: IHabit["id"];
	setCurrentlyEditedHabitId: (id?: IHabit["id"]) => void;
	refreshList: VoidFunction;
}

export const EditableHabitNameInput: React.FC<EditableHabitNameInputProps> = ({
	name,
	id,
	currentlyEditedHabitId,
	setCurrentlyEditedHabitId,
	refreshList,
}) => {
	const [newHabitName, setNewHabitName] = React.useState(() => name);
	const editHabitRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: () => {
			setCurrentlyEditedHabitId();
			refreshList();
		},
	});

	const isThisHabitNameCurrentlyEdited = currentlyEditedHabitId === id;
	const inputBgColor = isThisHabitNameCurrentlyEdited ? "bg-gray-100" : "";

	React.useEffect(() => {
		if (!isThisHabitNameCurrentlyEdited) {
			setNewHabitName(name);
		}
	}, [currentlyEditedHabitId]);

	return (
		<div className="flex justify-between items-center w-full">
			<HabitNameInput
				onKeyDown={event => {
					if (event.keyCode === 13 && newHabitName !== name) {
						editHabitRequestState.run(id, {name: newHabitName});
					}
				}}
				onFocus={() => setCurrentlyEditedHabitId(id)}
				className={`mx-4 p-1 break-words pr-4 flex-grow focus:bg-gray-100 ${inputBgColor}`}
				value={newHabitName}
				onChange={event => setNewHabitName(event.target.value)}
			/>
			{isThisHabitNameCurrentlyEdited && (
				<div>
					<button
						onClick={() => {
							if (newHabitName === name) {
								setCurrentlyEditedHabitId();
							} else editHabitRequestState.run(id, {name: newHabitName});
						}}
						className="uppercase mr-4"
						type="button"
					>
						Save
					</button>
					<button
						onClick={() => setCurrentlyEditedHabitId()}
						className="uppercase"
						type="button"
					>
						Reset
					</button>
				</div>
			)}
		</div>
	);
};
