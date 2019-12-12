import React from "react";

import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {IHabit} from "./interfaces/IHabit";

interface Props {
	habits: IHabit[];
	refreshList: VoidFunction;
}

export const HabitList: React.FC<Props> = ({habits, refreshList}) => {
	const [currentlyEditedHabitId, setCurrentlyEditedHabitId] = React.useState<
		IHabit["id"]
	>();

	return (
		<ul className="flex flex-col mt-12 bg-white p-4 pb-0 max-w-2xl w-full">
			{habits.map(habit => (
				<li className="flex align-baseline mb-4" key={habit.id}>
					<EditableHabitScoreSelect {...habit} refreshList={refreshList} />
					<div className="flex justify-between w-full">
						<EditableHabitNameInput
							{...habit}
							currentlyEditedHabitId={currentlyEditedHabitId}
							setCurrentlyEditedHabitId={setCurrentlyEditedHabitId}
							refreshList={refreshList}
						/>
						<DeleteHabitButton {...habit} refreshList={refreshList} />
					</div>
				</li>
			))}
		</ul>
	);
};
