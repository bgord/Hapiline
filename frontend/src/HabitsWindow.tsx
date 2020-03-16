import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import * as UI from "./ui";
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
import {FilterIcon} from "./ui/icons/Filter";
import {PlusIcon} from "./ui/icons/Plus";
import {useDocumentTitle} from "./hooks/useDocumentTitle";

export const HabitsWindow = () => {
	const getHabitsRequestState = useHabitsState();
	const [subview] = useQueryParam("subview");

	const {errorMessage} = getRequestStateErrors(getHabitsRequestState);

	useDocumentTitle("Hapiline - habit list");

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
		<UI.Column>
			{subview === "add_habit" && <AddHabitForm />}

			<Async.IfSettled state={getHabitsRequestState}>
				<UI.Card mx="auto" mt="48" mb="24" style={{width: "800px"}}>
					<UI.Row bg="gray-1" mt="12" p="24" mainAxis="between">
						<UI.Header variant="large">Habit list</UI.Header>
						<UI.Button
							disabled={filteredHabits.length === 0}
							style={{width: "145px"}}
							variant="secondary"
							onClick={() => {
								resetAllFilters();
								toggleFilters();
							}}
						>
							<FilterIcon mr="auto" />
							{areFiltersVisible ? "Hide filters" : "Show filters"}
						</UI.Button>
					</UI.Row>
					{areFiltersVisible && (
						<UI.Row mt="48" px="24" crossAxis="start">
							<UI.Column pr="72" bw="2" br="gray-1">
								<UI.Text variant="semi-bold">Scores</UI.Text>
								<UI.Row mt="24" crossAxis="center">
									<HabitScoreFilters.Positive.Input
										disabled={habitCounts.positive === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Positive.Label>
										Positive ({habitCounts.positive})
									</HabitScoreFilters.Positive.Label>
								</UI.Row>
								<UI.Row mt="12" crossAxis="center">
									<HabitScoreFilters.Neutral.Input
										disabled={habitCounts.neutral === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Neutral.Label>
										Neutral ({habitCounts.neutral})
									</HabitScoreFilters.Neutral.Label>
								</UI.Row>
								<UI.Row mt="12" crossAxis="center">
									<HabitScoreFilters.Negative.Input
										disabled={habitCounts.negative === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Negative.Label>
										Negative ({habitCounts.negative})
									</HabitScoreFilters.Negative.Label>
								</UI.Row>
								<UI.Row mt="12" crossAxis="center">
									<HabitScoreFilters.All.Input
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.All.Label>
										All scores ({habitCounts.all})
									</HabitScoreFilters.All.Label>
								</UI.Row>
							</UI.Column>
							<UI.Column ml="72">
								<UI.Text variant="semi-bold">Strengths</UI.Text>
								<UI.Row mt="24">
									<HabitStrengthFilters.Established.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={habitCounts.established === 0}
									/>
									<HabitStrengthFilters.Established.Label>
										Established ({habitCounts.established})
									</HabitStrengthFilters.Established.Label>
								</UI.Row>
								<UI.Row mt="12">
									<HabitStrengthFilters.Developing.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={habitCounts.developing === 0}
									/>
									<HabitStrengthFilters.Developing.Label>
										Developing ({habitCounts.developing})
									</HabitStrengthFilters.Developing.Label>
								</UI.Row>
								<UI.Row mt="12">
									<HabitStrengthFilters.Fresh.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={habitCounts.fresh === 0}
									/>
									<HabitStrengthFilters.Fresh.Label>
										Fresh ({habitCounts.fresh})
									</HabitStrengthFilters.Fresh.Label>
								</UI.Row>
								<UI.Row mt="12">
									<HabitStrengthFilters.All.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
									/>
									<HabitStrengthFilters.All.Label>
										All strengths ({habitCounts.all})
									</HabitStrengthFilters.All.Label>
								</UI.Row>
							</UI.Column>
							<UI.Button ml="auto" mb="auto" variant="outlined" onClick={resetAllFilters}>
								Reset filters
							</UI.Button>
						</UI.Row>
					)}
					<UI.Row px="24" mb="24" mt="48" crossAxis="end">
						<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />
						<UI.Button ml="12" variant="outlined" onClick={habitSearch.clearPhrase}>
							Clear
						</UI.Button>
						<UI.Button
							style={{width: "125px"}}
							ml="auto"
							variant="primary"
							onClick={openAddFormDialog}
						>
							<PlusIcon mr="auto" style={{stroke: "var(--gray-1)"}} />
							New habit
						</UI.Button>
					</UI.Row>
					<UI.Row mainAxis="end" mt="24" mb="24" px="24">
						<UI.Text data-testid="habit-search-result-count">
							<UI.Text variant="bold">{howManyResults}</UI.Text> results
						</UI.Text>
					</UI.Row>
					<Async.IfFulfilled state={getHabitsRequestState}>
						{filteredHabits.length === 0 && (
							<UI.InfoBanner size="big" mt="48" mx="24">
								It seems you haven't added any habits yet.
							</UI.InfoBanner>
						)}
					</Async.IfFulfilled>
					<Async.IfRejected state={getHabitsRequestState}>
						<UI.ErrorBanner size="big" mt="48" mx="24">
							{errorMessage}
							<UI.Button onClick={getHabitsRequestState.reload} ml="24" variant="outlined">
								Retry
							</UI.Button>
						</UI.ErrorBanner>
					</Async.IfRejected>
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="habits">
							{provided => (
								<UI.Column
									ref={provided.innerRef}
									as="ul"
									mt="48"
									bg="gray-3"
									bt="gray-1"
									{...provided.droppableProps}
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
								</UI.Column>
							)}
						</Droppable>
					</DragDropContext>
				</UI.Card>
			</Async.IfSettled>
		</UI.Column>
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
