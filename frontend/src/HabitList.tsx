import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {HabitListItem} from "./HabitListItem";
import {HabitStrengthFilters, useHabitStrengthFilter} from "./hooks/useHabitStrengthFilter";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {HabitScoreFilters, useHabitScoreFilter} from "./hooks/useHabitScoreFilter";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
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

	const [, updateSubviewQueryParam] = useQueryParam("subview");

	const habitStrengthFilter = useHabitStrengthFilter();
	const habitScoreFilter = useHabitScoreFilter();
	const habitSearch = useHabitSearch();

	const habitCounts = getHabitCounts(habits);

	const filteredHabits = habits
		.filter(habitScoreFilter.filterFunction)
		.filter(habitStrengthFilter.filterFunction)
		.filter(habitSearch.filterFn);
	const howManyResults = filteredHabits.length;

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

	const isDragDisabled =
		habitScoreFilter.value !== "all-scores" ||
		habitStrengthFilter.value !== "all-strengths" ||
		habitSearch.value !== "";

	function openAddFormDialog() {
		updateSubviewQueryParam("add_habit");
	}

	return (
		<>
			<div className="ml-auto">
				<button
					onClick={openAddFormDialog}
					className="btn btn-blue ml-auto h-10 mt-4"
					type="button"
				>
					Add habit
				</button>
			</div>
			<div className="flex w-full mt-16 mb-6">
				<HabitScoreFilters.Positive.Input
					disabled={habitCounts.positive === 0}
					value={habitScoreFilter.value}
					onChange={habitScoreFilter.onChange}
				/>
				<HabitScoreFilters.Positive.Label>
					Positive ({habitCounts.positive})
				</HabitScoreFilters.Positive.Label>

				<HabitScoreFilters.Neutral.Input
					disabled={habitCounts.neutral === 0}
					value={habitScoreFilter.value}
					onChange={habitScoreFilter.onChange}
				/>
				<HabitScoreFilters.Neutral.Label>
					Neutral ({habitCounts.neutral})
				</HabitScoreFilters.Neutral.Label>

				<HabitScoreFilters.Negative.Input
					disabled={habitCounts.negative === 0}
					value={habitScoreFilter.value}
					onChange={habitScoreFilter.onChange}
				/>
				<HabitScoreFilters.Negative.Label>
					Negative ({habitCounts.negative})
				</HabitScoreFilters.Negative.Label>

				<HabitScoreFilters.All.Input
					value={habitScoreFilter.value}
					onChange={habitScoreFilter.onChange}
				/>
				<HabitScoreFilters.All.Label>All scores ({habitCounts.all})</HabitScoreFilters.All.Label>

				<BareButton
					onClick={() => {
						habitScoreFilter.reset();
						habitStrengthFilter.reset();
						habitSearch.clearPhrase();
					}}
					className="ml-auto"
				>
					Reset filters
				</BareButton>
			</div>
			<div className="flex w-full mb-6">
				<HabitStrengthFilters.Established.Input
					value={habitStrengthFilter.value}
					onChange={habitStrengthFilter.onChange}
					disabled={habitCounts.established === 0}
				/>
				<HabitStrengthFilters.Established.Label>
					Established ({habitCounts.established})
				</HabitStrengthFilters.Established.Label>

				<HabitStrengthFilters.Developing.Input
					value={habitStrengthFilter.value}
					onChange={habitStrengthFilter.onChange}
					disabled={habitCounts.developing === 0}
				/>
				<HabitStrengthFilters.Developing.Label>
					Developing ({habitCounts.developing})
				</HabitStrengthFilters.Developing.Label>

				<HabitStrengthFilters.Fresh.Input
					value={habitStrengthFilter.value}
					onChange={habitStrengthFilter.onChange}
					disabled={habitCounts.fresh === 0}
				/>
				<HabitStrengthFilters.Fresh.Label>
					Fresh ({habitCounts.fresh})
				</HabitStrengthFilters.Fresh.Label>

				<HabitStrengthFilters.All.Input
					value={habitStrengthFilter.value}
					onChange={habitStrengthFilter.onChange}
				/>
				<HabitStrengthFilters.All.Label>
					All strengths ({habitCounts.all})
				</HabitStrengthFilters.All.Label>
			</div>
			<div className="flex w-full items-center mr-auto mb-6 ml-2">
				<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />
				<BareButton onClick={habitSearch.clearPhrase}>Clear</BareButton>
				<div className="ml-auto mr-4">Results: {howManyResults}</div>
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

function getHabitCounts(habits: IHabit[]) {
	const countByScore = (score: IHabit["score"]): number =>
		habits.filter(habit => habit.score === score).length;

	const countByStrength = (strength: IHabit["strength"]): number =>
		habits.filter(habit => habit.strength === strength).length;

	return {
		positive: countByScore("positive"),
		neutral: countByScore("neutral"),
		negative: countByScore("negative"),
		established: countByStrength("established"),
		developing: countByStrength("developing"),
		fresh: countByStrength("fresh"),
		all: habits.length,
	};
}
