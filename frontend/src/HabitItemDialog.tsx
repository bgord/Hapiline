import {Dialog} from "@reach/dialog";
import {format} from "date-fns";
import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {IHabit} from "./interfaces/IHabit";

interface Props {
	habit: IHabit;
	refreshList: VoidFunction;
	close: VoidFunction;
}

export const HabitItemDialog: React.FC<Props> = ({refreshList, habit}) => {
	return (
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
			<dl className="flex items-baseline mt-4 ml-20 pl-2">
				<dt className="text-gray-600 uppercase text-sm font-bold">
					Created at:
				</dt>
				<dd className="text-sm ml-1 font-mono">
					{format(new Date(habit.created_at), "yyyy/MM/dd HH:mm")}
				</dd>
				<dt className="text-gray-600 uppercase text-sm font-bold ml-4">
					Updated at:
				</dt>
				<dd className="text-sm ml-1 font-mono">
					{format(new Date(habit.updated_at), "yyyy/MM/dd HH:mm")}
				</dd>
			</dl>
		</Dialog>
	);
};
