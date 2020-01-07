import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit, HabitScore as HabitScoreType} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";

type HabitScoreFilter = HabitScoreType | "all";

const scoreFilterToFunction: {[key in HabitScoreFilter]: (habit: IHabit) => boolean} = {
	all: () => true,
	positive: habit => habit.score === "positive",
	neutral: habit => habit.score === "neutral",
	negative: habit => habit.score === "negative",
};

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

	const [scoreFilter, setScoreFilter] = React.useState<HabitScoreFilter>("all");

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

	function onScoreFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isHabitScoreFilter(value)) {
			setScoreFilter(value);
		}
	}

	const isDragDisabled = scoreFilter !== "all";

	return (
		<>
			<div className="flex w-full mt-16 mb-6">
				<input
					name="filter"
					id="positive"
					type="radio"
					value="positive"
					checked={scoreFilter === "positive"}
					onChange={onScoreFilterChange}
					className="mr-1 ml-3"
				/>
				<label htmlFor="positive">Positive ({positiveHabitsCount})</label>

				<input
					name="filter"
					id="neutral"
					type="radio"
					value="neutral"
					checked={scoreFilter === "neutral"}
					onChange={onScoreFilterChange}
					className="mr-1 ml-8"
					disabled={neutralHabitsCount === 0}
				/>
				<label htmlFor="neutral">Neutral ({neutralHabitsCount})</label>

				<input
					name="filter"
					id="negative"
					type="radio"
					value="negative"
					checked={scoreFilter === "negative"}
					onChange={onScoreFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="negative">Negative ({negativeHabitsCount})</label>

				<input
					name="filter"
					id="all"
					type="radio"
					value="all"
					checked={scoreFilter === "all"}
					onChange={onScoreFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="all">All scores ({howManyHabitsAtAll})</label>
				<BareButton onClick={() => setScoreFilter("all")} className="ml-auto">
					Reset filters
				</BareButton>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="habits">
					{provided => (
						<ul
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="flex flex-col bg-white p-4 pb-0 w-full"
						>
							{habits.filter(scoreFilterToFunction[scoreFilter]).map((habit, index) => (
								<HabitListItem
									isDragDisabled={isDragDisabled}
									key={habit.id}
									habit={habit}
									index={index}
								/>
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
	isDragDisabled: boolean;
}

const HabitListItem: React.FC<HabitListItemProps> = ({habit, index, isDragDisabled}) => {
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

function isHabitScoreFilter(value: string): value is HabitScoreFilter {
	return ["positive", "neutral", "negative", "all"].includes(value);
}
