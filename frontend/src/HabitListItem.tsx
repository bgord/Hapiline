import {Draggable} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import React from "react";

import {Button} from "./ui/button/Button";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit} from "./interfaces/IHabit";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
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
					className="flex items-baseline p-1"
					data-testid="draggable-habit-item"
					style={{background: "#f9f8f8", marginBottom: "12px"}}
				>
					<HabitScore score={habit.score} />
					<HabitStrength strength={habit.strength} />
					<Row ml="12" mainAxis="between">
						<Text>{habit.name}</Text>
						<Row width="auto">
							{!habit.is_trackable && <Text mr="6">NT</Text>}
							<Button variant="outlined" onClick={openPreviewDialog}>
								More
							</Button>
							<DeleteHabitButton {...habit} />
						</Row>
					</Row>
					{doesPreviewHabitIdMatch && (
						<HabitItemDialog habitId={habit.id} closeDialog={closePreviewDialog} />
					)}
				</li>
			)}
		</Draggable>
	);
};
