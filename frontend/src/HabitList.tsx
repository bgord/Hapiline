import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import * as Async from "react-async";
import React from "react";

import {Text} from "./ui/text/Text";
import {Button} from "./ui/button/Button";
import {Header} from "./ui/header/Header";
import {HabitListItem} from "./HabitListItem";
import {HabitStrengthFilters, useHabitStrengthFilter} from "./hooks/useHabitStrengthFilter";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {HabitScoreFilters, useHabitScoreFilter} from "./hooks/useHabitScoreFilter";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";
import {useToggle} from "./hooks/useToggle";

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

	const [areFiltersVisible, , , toggleFilters] = useToggle();

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

	function resetAllFilters() {
		habitScoreFilter.reset();
		habitStrengthFilter.reset();
		habitSearch.clearPhrase();
	}

	return (
		<>
			<div className="flex justify-end items-center w-full mt-4">
				<Header variant="large" style={{marginRight: "auto", marginLeft: "12px"}}>
					Habit list
				</Header>
				<Button
					variant="secondary"
					onClick={() => {
						resetAllFilters();
						toggleFilters();
					}}
					style={{marginRight: "12px"}}
				>
					{areFiltersVisible ? "Hide filters" : "Show filters"}
				</Button>
				<Button variant="primary" onClick={openAddFormDialog}>
					New habit
				</Button>
			</div>
			{areFiltersVisible && (
				<div className="flex items-center w-full mt-10 mb-3">
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

					<Button variant="outlined" onClick={resetAllFilters} style={{marginLeft: "auto"}}>
						Reset filters
					</Button>
				</div>
			)}
			{areFiltersVisible && (
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
			)}
			<div className={`flex w-full items-end mr-auto mb-6 ml-3 mt-${areFiltersVisible ? 4 : 12}`}>
				<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />
				<Button variant="outlined" onClick={habitSearch.clearPhrase} style={{marginLeft: "12px"}}>
					Clear
				</Button>
				<Text style={{marginLeft: "auto", marginRight: "16px"}}>
					<Text variant="bold">{howManyResults}</Text> results
				</Text>
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
