import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit} from "./interfaces/IHabit";
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

	const positiveHabitsCount = habits.filter(habit => habit.score === "positive").length;
	const negativeHabitsCount = habits.filter(habit => habit.score === "negative").length;
	const neutralHabitsCount = habits.filter(habit => habit.score === "neutral").length;

	const howManyHabitsAtAll = habits.length;

	return (
		<>
			<div className="flex w-full mt-16 mb-6">
				<input
					name="filter"
					id="voted"
					type="radio"
					value="voted"
					// checked={filter === "voted"}
					// onChange={onFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="voted">Positive ({positiveHabitsCount})</label>

				<input
					name="filter"
					id="unvoted"
					type="radio"
					value="unvoted"
					// checked={filter === "unvoted"}
					// onChange={onFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="unvoted">Neutral ({neutralHabitsCount})</label>

				<input
					name="filter"
					id="unvoted"
					type="radio"
					value="unvoted"
					// checked={filter === "unvoted"}
					// onChange={onFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="unvoted">Negative ({negativeHabitsCount})</label>

				<input
					name="filter"
					id="all"
					type="radio"
					value="all"
					// checked={filter === "all"}
					// onChange={onFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="all">All scores ({howManyHabitsAtAll})</label>
				<BareButton className="ml-auto">Reset filters</BareButton>
			</div>
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
		</>
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
					<HabitScore score={habit.score} />
					<HabitStrength strength={habit.strength} />
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
