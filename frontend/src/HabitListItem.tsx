import {Draggable} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import React from "react";

import {Button} from "./ui/button/Button";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit} from "./interfaces/IHabit";
import {useQueryParam} from "./hooks/useQueryParam";

interface HabitListItemProps {
	habit: IHabit;
	index: number;
	isDragDisabled: boolean;
}

export const HabitListItem: React.FC<HabitListItemProps> = ({habit, index, isDragDisabled}) => {
	const history = useHistory();
	const [previewHabitId, updateQueryParam] = useQueryParam("preview_habit_id");

	const doesPreviewHabitIdMatch = habit.id === Number(previewHabitId);

	function openPreviewDialog() {
		updateQueryParam(habit.id.toString());
	}
	function closePreviewDialog() {
		history.push("/habits");
	}

	return (
		<Draggable
			isDragDisabled={isDragDisabled}
			key={habit.id}
			draggableId={habit.id.toString()}
			index={index}
		>
			{provided => (
				<li
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="flex items-baseline mb-4"
					data-testid="draggable-habit-item"
				>
					<HabitScore score={habit.score} />
					<HabitStrength strength={habit.strength} />
					<div className="flex justify-between w-full">
						<div className="p-2 bg-gray-100 ml-2 w-full">{habit.name}</div>
						<div className="flex items-center ml-4">
							{!habit.is_trackable && <div className="mr-2">NT</div>}
							<Button variant="outlined" onClick={openPreviewDialog}>
								More
							</Button>
							<DeleteHabitButton {...habit} />
						</div>
					</div>
					{doesPreviewHabitIdMatch && (
						<HabitItemDialog habitId={habit.id} closeDialog={closePreviewDialog} />
					)}
				</li>
			)}
		</Draggable>
	);
};
