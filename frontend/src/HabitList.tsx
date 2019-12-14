import React from "react";

import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {IHabit} from "./interfaces/IHabit";

interface Props {
	habits: IHabit[];
	refreshList: VoidFunction;
}

export const HabitList: React.FC<Props> = ({habits, refreshList}) => (
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
						<HabitItemDialog
							habitId={habit.id}
							close={close}
							refreshList={refreshList}
						/>
					)}
				</li>
			);
		})}
	</ul>
);
