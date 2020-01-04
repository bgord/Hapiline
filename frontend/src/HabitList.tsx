import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {IHabit, scoreToBgColor, strengthToBgColor} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";

export const HabitList: React.FC = () => {
	const getHabitsRequestState = useHabitsState();
	const habits = useHabits();

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const reorderHabitsRequestState = Async.useAsync({
		deferFn: api.habit.reorder,
		onResolve: () => triggerSuccessNotification("Habits reordered successfully!"),
		onReject: () => triggerErrorNotification("Error while changing order."),
	});

	function onDragEnd(result: DropResult) {
		if (!result.destination) return;

		const fromIndex = result.source.index;
		const toIndex = result.destination.index;

		if (fromIndex === toIndex) return;

		const reorderedHabits = reorder(habits, fromIndex, toIndex);

		const reorderHabitsPayload = reorderedHabits.map((habit, index) => ({
			id: habit.id,
			index,
		}));

		reorderHabitsRequestState.run({habits: reorderHabitsPayload});
		getHabitsRequestState.setData(reorderedHabits);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="habits">
				{provided => (
					<ul
						ref={provided.innerRef}
						{...provided.droppableProps}
						className="flex flex-col bg-white p-4 pb-0 w-full"
					>
						{habits.map((habit, index) => (
							<HabitListItem key={habit.id} habit={habit} index={index} />
						))}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	);
};

interface HabitListItemProps {
	habit: IHabit;
	index: number;
}

const HabitListItem: React.FC<HabitListItemProps> = ({habit, index}) => {
	const history = useHistory();
	const previewHabitId = useQueryParam("previewHabitId");

	const doesPreviewHabitIdMatch = previewHabitId && habit.id === Number(previewHabitId);

	const scoreBgColor = scoreToBgColor[habit.score];
	const strengthBgColor = strengthToBgColor[habit.strength];

	function openPreviewDialog() {
		history.push(`/dashboard?previewHabitId=${habit.id}`);
	}
	function closePreviewDialog() {
		history.push("/dashboard");
	}

	return (
		<Draggable key={habit.id} draggableId={habit.id.toString()} index={index}>
			{provided => (
				<li
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="flex items-baseline mb-4"
					data-testid="draggable-habit-item"
				>
					<div className={`${scoreBgColor} w-24 pl-1 p-2 text-center`}>{habit.score}</div>
					<div className={`${strengthBgColor} w-32 ml-2 pl-1 p-2 text-center`}>
						{habit.strength}
					</div>
					<div className="flex justify-between w-full">
						<div className="p-2 bg-gray-100 ml-2 w-full">{habit.name}</div>
						<div className="flex ml-4">
							<BareButton onClick={openPreviewDialog}>More</BareButton>
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

function reorder(habits: IHabit[], fromIndex: number, toIndex: number): IHabit[] {
	const result = Array.from(habits);
	const [removed] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, removed);
	return result;
}
