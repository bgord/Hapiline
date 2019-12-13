import {Dialog} from "@reach/dialog";
import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {IHabit} from "./interfaces/IHabit";

interface Props {
	habits: IHabit[];
	refreshList: VoidFunction;
}

export const HabitList: React.FC<Props> = ({habits, refreshList}) => {
	return (
		<ul className="flex flex-col mt-12 bg-white p-4 pb-0 max-w-2xl w-full">
			{habits.map(habit => {
				const [showDialog, setShowDialog] = React.useState(false);
				const open = () => setShowDialog(true);
				const close = () => setShowDialog(false);

				return (
					<li className="flex items-baseline mb-4" key={habit.id}>
						<div className="bg-gray-300 w-20 pl-1 p-2 text-center">
							{habit.score}
						</div>
						<div className="flex justify-between w-full">
							<div className="p-2 bg-gray-100 ml-2 w-full">{habit.name}</div>
							<div className="flex ml-4">
								<button className="uppercase" onClick={open}>
									more
								</button>
								<DeleteHabitButton {...habit} refreshList={refreshList} />
							</div>
						</div>
						{showDialog && (
							<Dialog
								style={{
									maxWidth: "1000px",
									maxHeight: "500px",
								}}
								className="w-full h-full"
								onDismiss={refreshList}
							>
								<div className="flex justify-between items-center mb-8">
									<h2 className="font-bold">Habit preview</h2>
									<button
										className="p-2"
										onClick={() => {
											close();
											refreshList();
										}}
									>
										<VisuallyHidden>Close</VisuallyHidden>
										<span aria-hidden>×</span>
									</button>
								</div>
								<div className="flex items-end">
									<EditableHabitScoreSelect {...habit} />
									<EditableHabitNameInput {...habit} />
								</div>
							</Dialog>
						)}
					</li>
				);
			})}
		</ul>
	);
};
