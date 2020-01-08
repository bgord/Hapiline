import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {HabitListItem} from "./HabitListItem";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitScoreFilter} from "./hooks/useHabitScoreFilter";
import {useHabitSearch} from "./hooks/useHabitSearch";
import {useHabitStrengthFilter} from "./hooks/useHabitStrengthFilter";
import {useHabits, useHabitsState} from "./contexts/habits-context";

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

	const habitStrengthFilter = useHabitStrengthFilter();
	const habitScoreFilter = useHabitScoreFilter();
	const habitSearch = useHabitSearch();

	const positiveHabitsCount = habits.filter(habit => habit.score === "positive").length;
	const negativeHabitsCount = habits.filter(habit => habit.score === "negative").length;
	const neutralHabitsCount = habits.filter(habit => habit.score === "neutral").length;

	const establishedHabitsCount = habits.filter(habit => habit.strength === "established").length;
	const developingHabitsCount = habits.filter(habit => habit.strength === "developing").length;
	const freshHabitsCount = habits.filter(habit => habit.strength === "fresh").length;

	const howManyHabitsAtAll = habits.length;

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
		.filter(habitStrengthFilter.filterFunction)
		.filter(habitSearch.filterFn);

	const howManyResults = filteredHabits.length;

	const isDragDisabled =
		habitScoreFilter.current !== "all" ||
		habitStrengthFilter.current !== "all" ||
		habitSearch.phrase !== "";

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
						habitStrengthFilter.setNewValue("all");
						habitSearch.clearPhrase();
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
					checked={habitStrengthFilter.current === "established"}
					onChange={habitStrengthFilter.onChange}
					className="mr-1 ml-3"
					disabled={establishedHabitsCount === 0}
				/>
				<label htmlFor="established">Established ({establishedHabitsCount})</label>

				<input
					name="strengthFilter"
					id="developing"
					type="radio"
					value="developing"
					checked={habitStrengthFilter.current === "developing"}
					onChange={habitStrengthFilter.onChange}
					className="mr-1 ml-8"
					disabled={developingHabitsCount === 0}
				/>
				<label htmlFor="developing">Developing ({developingHabitsCount})</label>

				<input
					name="strengthFilter"
					id="fresh"
					type="radio"
					value="fresh"
					checked={habitStrengthFilter.current === "fresh"}
					onChange={habitStrengthFilter.onChange}
					className="mr-1 ml-8"
					disabled={freshHabitsCount === 0}
				/>
				<label htmlFor="fresh">Fresh ({freshHabitsCount})</label>

				<input
					name="strengthFilter"
					id="allStrengths"
					type="radio"
					value="all"
					checked={habitStrengthFilter.current === "all"}
					onChange={habitStrengthFilter.onChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="allStrengths">All strengths ({howManyHabitsAtAll})</label>
				<div className="ml-auto">Results: {howManyResults}</div>
			</div>
			<div className="mr-auto mb-6 ml-2">
				<input
					className="field p-1 w-64"
					type="search"
					value={habitSearch.phrase}
					onChange={habitSearch.onChange}
					placeholder="Search for habits..."
				/>
				<BareButton onClick={habitSearch.clearPhrase}>Clear</BareButton>
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

function reorder(habits: IHabit[], fromIndex: number, toIndex: number): IHabit[] {
	const result = Array.from(habits);
	const [removed] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, removed);
	return result;
}
