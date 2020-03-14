import {Draggable} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import React from "react";

import * as UI from "./ui/";
import {HabitItemDialog} from "./HabitItemDialog";
import {IHabit, habitStrengthToBadgeVariant} from "./interfaces/IHabit";
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
			{(provided, snapshot) => (
				<li
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					data-testid="draggable-habit-item"
					data-bg="0"
					data-state={snapshot.isDragging ? "dragging" : "idle"}
				>
					<UI.Column
						px="24"
						py="6"
						pb="12"
						style={{
							borderTop: "1px solid var(--gray-1)",
							borderBottom: "1px solid var(--gray-1)",
							cursor: "move",
						}}
					>
						<UI.Row mainAxis="between" crossAxis="baseline">
							<UI.Text variant="semi-bold">{habit.name}</UI.Text>
							<UI.Button ml="auto" variant="outlined" onClick={openPreviewDialog}>
								More
							</UI.Button>
						</UI.Row>
						<UI.Row mt="6">
							<UI.Badge mr="6" variant={habit.score}>
								{habit.score}
							</UI.Badge>
							<UI.Badge ml="6" variant={habitStrengthToBadgeVariant[habit.strength]}>
								{habit.strength}
							</UI.Badge>
							{!habit.is_trackable && (
								<UI.Badge ml="12" variant="neutral">
									Untracked
								</UI.Badge>
							)}
						</UI.Row>
					</UI.Column>
					{doesPreviewHabitIdMatch && (
						<HabitItemDialog habitId={habit.id} closeDialog={closePreviewDialog} />
					)}
				</li>
			)}
		</Draggable>
	);
};
