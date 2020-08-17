import {Draggable} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import React from "react";

import * as UI from "./ui/";
import {HabitItemDialog} from "./HabitItemDialog";
import {useQueryParam} from "./hooks/useQueryParam";
import {Habit, habitStrengthToBadgeVariant} from "./models";

interface HabitListItemProps {
	habit: Habit;
	index: number;
	isDragDisabled: boolean;
}

export function HabitListItem({habit, index, isDragDisabled}: HabitListItemProps) {
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
			{(provided, snapshot) => (
				<UI.Column
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					data-testid="draggable-habit-item"
					bg="gray-0"
					data-state={snapshot.isDragging ? "dragging" : "idle"}
					ref={provided.innerRef}
					as="li"
					px={["24", "6"]}
					py="6"
					pb="12"
					by="gray-1"
					style={{cursor: "move", ...provided.draggableProps.style}}
				>
					<UI.Row mainAxis="between" crossAxis="baseline">
						<UI.Text variant="semi-bold" mr="12">
							{habit.name}
						</UI.Text>
						<UI.Button ml="auto" variant="outlined" onClick={openPreviewDialog}>
							More
						</UI.Button>
					</UI.Row>

					<UI.Row mt={["0", "24"]} wrap="wrap">
						<UI.Badge mt="6" mr="6" variant={habit.score}>
							{habit.score}
						</UI.Badge>

						<UI.Badge mt="6" mr={["24", "6"]} variant={habitStrengthToBadgeVariant[habit.strength]}>
							{habit.strength}
						</UI.Badge>

						{!habit.is_trackable && (
							<UI.Badge mt="6" variant="neutral">
								Untracked
							</UI.Badge>
						)}
					</UI.Row>

					{doesPreviewHabitIdMatch && (
						<HabitItemDialog habitId={habit.id} closeDialog={closePreviewDialog} />
					)}
				</UI.Column>
			)}
		</Draggable>
	);
}
