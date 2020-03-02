import {Draggable} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import React from "react";

import {BadgeVariant, Badge} from "./ui/badge/Badge";
import {Button} from "./ui/button/Button";
import {Column} from "./ui/column/Column";
import {HabitItemDialog} from "./HabitItemDialog";
import {IHabit} from "./interfaces/IHabit";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
import {useQueryParam} from "./hooks/useQueryParam";

interface HabitListItemProps {
	habit: IHabit;
	index: number;
	isDragDisabled: boolean;
}

const habitStrengthToBadgeVariant: {
	[key in IHabit["strength"]]: BadgeVariant;
} = {
	fresh: "light",
	developing: "normal",
	established: "strong",
};

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
					data-testid="draggable-habit-item"
					data-bg="0"
				>
					<Column
						data-px="24"
						data-py="6"
						data-pb="12"
						style={{
							borderTop: "1px solid var(--gray-1)",
							borderBottom: "1px solid var(--gray-1)",
							cursor: "move",
						}}
					>
						<Row mainAxis="between" crossAxis="baseline">
							<Text variant="semi-bold">{habit.name}</Text>
							<Button ml="auto" variant="outlined" onClick={openPreviewDialog}>
								More
							</Button>
						</Row>
						<Row mt="6">
							<Badge data-mr="6" variant={habit.score}>
								{habit.score}
							</Badge>
							<Badge data-ml="6" variant={habitStrengthToBadgeVariant[habit.strength]}>
								{habit.strength}
							</Badge>
							{!habit.is_trackable && (
								<Badge data-ml="12" variant="neutral">
									Untracked
								</Badge>
							)}
						</Row>
					</Column>
					{doesPreviewHabitIdMatch && (
						<HabitItemDialog habitId={habit.id} closeDialog={closePreviewDialog} />
					)}
				</li>
			)}
		</Draggable>
	);
};
