import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit, HabitStrength as HabitStrengthType} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitScoreFilter} from "./hooks/useHabitScoreFilter";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";

type HabitStrengthFilter = HabitStrengthType | "all";

const strengthFilterToFunction: {[key in HabitStrengthFilter]: (habit: IHabit) => boolean} = {
	all: () => true,
	established: habit => habit.strength === "established",
	developing: habit => habit.strength === "developing",
	fresh: habit => habit.strength === "fresh",
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

	const habitScoreFilter = useHabitScoreFilter();
	const [strengthFilter, setStrengthFilter] = React.useState<HabitStrengthFilter>("all");
	const [searchPhrase, setSearchPhrase] = React.useState("");

	const positiveHabitsCount = habits.filter(habit => habit.score === "positive").length;
	const negativeHabitsCount = habits.filter(habit => habit.score === "negative").length;
	const neutralHabitsCount = habits.filter(habit => habit.score === "neutral").length;

	const establishedHabitsCount = habits.filter(habit => habit.strength === "established").length;
	const developingHabitsCount = habits.filter(habit => habit.strength === "developing").length;
	const freshHabitsCount = habits.filter(habit => habit.strength === "fresh").length;

	const howManyHabitsAtAll = habits.length;

	function onStrengthFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isHabitStrengthFilter(value)) {
			setStrengthFilter(value);
		}
	}

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

	const filteredHabits = habits
		.filter(habitScoreFilter.filterFunction)
		.filter(strengthFilterToFunction[strengthFilter])
		.filter(habit => {
			if (!searchPhrase) return true;
			return habit.name.toLowerCase().includes(searchPhrase.toLowerCase());
		});

	const howManyResults = filteredHabits.length;

	const isDragDisabled =
		habitScoreFilter.current !== "all" || strengthFilter !== "all" || searchPhrase !== "";

	return (
		<>
			<div className="flex w-full mt-16 mb-6">
				<input
					name="scoreFilter"
					id="positive"
					type="radio"
					value="positive"
					checked={habitScoreFilter.current === "positive"}
					onChange={habitScoreFilter.onChange}
					className="mr-1 ml-3"
					disabled={positiveHabitsCount === 0}
				/>
				<label htmlFor="positive">Positive ({positiveHabitsCount})</label>

				<input
					name="scoreFilter"
					id="neutral"
					type="radio"
					value="neutral"
					checked={habitScoreFilter.current === "neutral"}
					onChange={habitScoreFilter.onChange}
					className="mr-1 ml-8"
					disabled={neutralHabitsCount === 0}
				/>
				<label htmlFor="neutral">Neutral ({neutralHabitsCount})</label>

				<input
					name="scoreFilter"
					id="negative"
					type="radio"
					value="negative"
					checked={habitScoreFilter.current === "negative"}
					onChange={habitScoreFilter.onChange}
					className="mr-1 ml-8"
					disabled={negativeHabitsCount === 0}
				/>
				<label htmlFor="negative">Negative ({negativeHabitsCount})</label>

				<input
					name="scoreFilter"
					id="allScores"
					type="radio"
					value="all"
					checked={habitScoreFilter.current === "all"}
					onChange={habitScoreFilter.onChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="allScores">All scores ({howManyHabitsAtAll})</label>
				<BareButton
					onClick={() => {
						habitScoreFilter.setNewValue("all");
						setStrengthFilter("all");
						setSearchPhrase("");
					}}
					className="ml-auto"
				>
					Reset filters
				</BareButton>
			</div>
			<div className="flex w-full mb-6">
				<input
					name="strengthFilter"
					id="established"
					type="radio"
					value="established"
					checked={strengthFilter === "established"}
					onChange={onStrengthFilterChange}
					className="mr-1 ml-3"
					disabled={establishedHabitsCount === 0}
				/>
				<label htmlFor="established">Established ({establishedHabitsCount})</label>

				<input
					name="strengthFilter"
					id="developing"
					type="radio"
					value="developing"
					checked={strengthFilter === "developing"}
					onChange={onStrengthFilterChange}
					className="mr-1 ml-8"
					disabled={developingHabitsCount === 0}
				/>
				<label htmlFor="developing">Developing ({developingHabitsCount})</label>

				<input
					name="strengthFilter"
					id="fresh"
					type="radio"
					value="fresh"
					checked={strengthFilter === "fresh"}
					onChange={onStrengthFilterChange}
					className="mr-1 ml-8"
					disabled={freshHabitsCount === 0}
				/>
				<label htmlFor="fresh">Fresh ({freshHabitsCount})</label>

				<input
					name="strengthFilter"
					id="allStrengths"
					type="radio"
					value="all"
					checked={strengthFilter === "all"}
					onChange={onStrengthFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="allStrengths">All strengths ({howManyHabitsAtAll})</label>
				<div className="ml-auto">Results: {howManyResults}</div>
			</div>
			<div className="mr-auto mb-6 ml-2">
				<input
					className="field p-1 w-64"
					type="search"
					value={searchPhrase}
					onChange={event => setSearchPhrase(event.target.value)}
					placeholder="Search for habits..."
				/>
				<BareButton onClick={() => setSearchPhrase("")}>Clear</BareButton>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="habits">
					{provided => (
						<ul
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="flex flex-col bg-white p-4 pb-0 w-full"
						>
							{filteredHabits.map((habit, index) => (
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

function isHabitStrengthFilter(value: string): value is HabitStrengthFilter {
	return ["established", "developing", "fresh", "all"].includes(value);
}
