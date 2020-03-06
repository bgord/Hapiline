import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {ExclamationIcon} from "./ui/icons/Exclamation";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {InfoIcon} from "./ui/icons/Info";
import {Banner, Card, Button, Column, Text, Row, Header} from "./ui";
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
		<Column>
			{subview === "add_habit" && <AddHabitForm />}

			<Async.IfSettled state={getHabitsRequestState}>
				<Card mx="auto" mt="48" mb="24" style={{width: "800px"}}>
					<Row mt="12" p="24" mainAxis="between" style={{background: "var(--gray-1)"}}>
						<Header variant="large">Habit list</Header>
						<Button
							disabled={filteredHabits.length === 0}
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "145px",
							}}
							variant="secondary"
							onClick={() => {
								resetAllFilters();
								toggleFilters();
							}}
						>
							<FilterIcon mr="auto" />
							{areFiltersVisible ? "Hide filters" : "Show filters"}
						</Button>
					</Row>
					{areFiltersVisible && (
						<Row mt="48" px="24" crossAxis="start">
							<Column pr="72" style={{borderRight: "2px solid var(--gray-1)"}}>
								<Text variant="semi-bold">Scores</Text>
								<Row mt="24" crossAxis="center">
									<HabitScoreFilters.Positive.Input
										disabled={habitCounts.positive === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Positive.Label>
										Positive ({habitCounts.positive})
									</HabitScoreFilters.Positive.Label>
								</Row>
								<Row mt="12" crossAxis="center">
									<HabitScoreFilters.Neutral.Input
										disabled={habitCounts.neutral === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Neutral.Label>
										Neutral ({habitCounts.neutral})
									</HabitScoreFilters.Neutral.Label>
								</Row>
								<Row mt="12" crossAxis="center">
									<HabitScoreFilters.Negative.Input
										disabled={habitCounts.negative === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Negative.Label>
										Negative ({habitCounts.negative})
									</HabitScoreFilters.Negative.Label>
								</Row>
								<Row mt="12" crossAxis="center">
									<HabitScoreFilters.All.Input
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.All.Label>
										All scores ({habitCounts.all})
									</HabitScoreFilters.All.Label>
								</Row>
							</Column>
							<Column ml="72">
								<Text variant="semi-bold">Strengths</Text>
								<Row mt="24">
									<HabitStrengthFilters.Established.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={habitCounts.established === 0}
									/>
									<HabitStrengthFilters.Established.Label>
										Established ({habitCounts.established})
									</HabitStrengthFilters.Established.Label>
								</Row>
								<Row mt="12">
									<HabitStrengthFilters.Developing.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={habitCounts.developing === 0}
									/>
									<HabitStrengthFilters.Developing.Label>
										Developing ({habitCounts.developing})
									</HabitStrengthFilters.Developing.Label>
								</Row>
								<Row mt="12">
									<HabitStrengthFilters.Fresh.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={habitCounts.fresh === 0}
									/>
									<HabitStrengthFilters.Fresh.Label>
										Fresh ({habitCounts.fresh})
									</HabitStrengthFilters.Fresh.Label>
								</Row>
								<Row mt="12">
									<HabitStrengthFilters.All.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
									/>
									<HabitStrengthFilters.All.Label>
										All strengths ({habitCounts.all})
									</HabitStrengthFilters.All.Label>
								</Row>
							</Column>
							<Button ml="auto" mb="auto" variant="outlined" onClick={resetAllFilters}>
								Reset filters
							</Button>
						</Row>
					)}
					<Row px="24" mb="24" mt="48" crossAxis="end">
						<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />
						<Button ml="12" variant="outlined" onClick={habitSearch.clearPhrase}>
							Clear
						</Button>
						<Button
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "125px",
							}}
							ml="auto"
							variant="primary"
							onClick={openAddFormDialog}
						>
							<PlusIcon mr="auto" style={{stroke: "var(--gray-1)"}} />
							New habit
						</Button>
					</Row>
					<Row mainAxis="end" mt="24" mb="24" px="24">
						<Text data-testid="habit-search-result-count">
							<Text variant="bold">{howManyResults}</Text> results
						</Text>
					</Row>
					<Async.IfFulfilled state={getHabitsRequestState}>
						{filteredHabits.length === 0 && (
							<Banner data-mt="48" data-mx="24" data-p="12" variant="info">
								<InfoIcon />
								<Text ml="12">It seems you haven't added any habits yet.</Text>
							</Banner>
						)}
					</Async.IfFulfilled>
					<Async.IfRejected state={getHabitsRequestState}>
						<Banner data-mt="48" data-mx="24" data-p="12" variant="error">
							<ExclamationIcon stroke="#682d36" />
							<Text style={{color: "#682d36"}} ml="12">
								{errorMessage}
							</Text>
							<Button onClick={getHabitsRequestState.reload} ml="24" variant="outlined">
								Retry
							</Button>
						</Banner>
					</Async.IfRejected>
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="habits">
							{provided => (
								<ul
									data-mt="48"
									ref={provided.innerRef}
									style={{borderTop: "1px solid var(--gray-1)", background: "var(--gray-3)"}}
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
								</ul>
							)}
						</Droppable>
					</DragDropContext>
				</Card>
			</Async.IfSettled>
		</Column>
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
