import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import {queryCache, useMutation} from "react-query";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import * as UI from "./ui";
import {HabitListItem} from "./HabitListItem";
import {HabitStrengthFilters, useHabitStrengthFilter} from "./hooks/useHabitStrengthFilter";
import {api, AsyncReturnType} from "./services/api";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {HabitScoreFilters, useHabitScoreFilter} from "./hooks/useHabitScoreFilter";
import {useHabitSearch} from "./hooks/useHabitSearch";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";
import {useToggle} from "./hooks/useToggle";
import {FilterIcon} from "./ui/icons/Filter";
import {PlusIcon} from "./ui/icons/Plus";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {Habit, ReorderHabitPayload} from "./models";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

export const HabitsWindow = () => {
	useDocumentTitle("Hapiline - habit list");

	const mediaQuery = useMediaQuery();

	const getHabitsRequestState = useHabitsState();
	const {errorMessage} = getRequestStateErrors(getHabitsRequestState);

	const habits = useHabits();

	const [subview] = useQueryParam("subview");

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const [reorderHabits] = useMutation<unknown, {habits: ReorderHabitPayload[]}>(api.habit.reorder, {
		onSuccess: () => triggerSuccessToast("Habits reordered successfully!"),
		onError: () => triggerErrorToast("Error while changing order."),
	});

	const [, updateSubviewQueryParam] = useQueryParam("subview");

	const {on: areFiltersVisible, toggle: toggleFilters} = useToggle();

	const habitStrengthFilter = useHabitStrengthFilter();
	const habitScoreFilter = useHabitScoreFilter();
	const habitSearch = useHabitSearch();

	const numbersOfHabitsByQueries = getNumbersOfHabitsByQueries(habits);

	const filteredHabits = habits
		.filter(habitScoreFilter.filterFunction)
		.filter(habitStrengthFilter.filterFunction)
		.filter(habit => habitSearch.filterFn(habit.name));

	const numberOfHabitResults = filteredHabits.length;

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

		reorderHabits({habits: reorderHabitsPayload});

		const _reorderedHabits: AsyncReturnType<typeof api.habit.get> = reorderedHabits;
		queryCache.setQueryData("all_habits", _reorderedHabits);
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
		<UI.Column
			as="main"
			tabIndex={0}
			mx={["auto", "6"]}
			mt={["48", "12"]}
			mb="24"
			width={["view-l", "auto"]}
		>
			{subview === "add_habit" && <AddHabitForm />}

			<UI.ShowIf request={getHabitsRequestState} is={["error", "success"]}>
				<UI.Card>
					<UI.Row bg="gray-1" mt="12" p={["24", "12"]} mainAxis="between" wrap="wrap">
						<UI.Header as="h1" variant={["large", "small"]}>
							Habit list
						</UI.Header>

						{mediaQuery === MEDIA_QUERY.default && (
							<UI.Button
								disabled={filteredHabits.length === 0}
								style={{width: "145px"}}
								variant="secondary"
								layout="with-icon"
								onClick={() => {
									resetAllFilters();
									toggleFilters();
								}}
							>
								<FilterIcon mr="auto" />
								{areFiltersVisible ? "Hide filters" : "Show filters"}
							</UI.Button>
						)}
					</UI.Row>

					{areFiltersVisible && mediaQuery === MEDIA_QUERY.default && (
						<UI.Row mt="48" px="24" crossAxis="start">
							<UI.Column pr="72" bw="2" br="gray-1">
								<UI.Text variant="semi-bold">Scores</UI.Text>
								<UI.Row mt="24" crossAxis="center">
									<HabitScoreFilters.Positive.Input
										disabled={numbersOfHabitsByQueries.positive === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Positive.Label>
										Positive ({numbersOfHabitsByQueries.positive})
									</HabitScoreFilters.Positive.Label>
								</UI.Row>
								<UI.Row mt="12" crossAxis="center">
									<HabitScoreFilters.Neutral.Input
										disabled={numbersOfHabitsByQueries.neutral === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Neutral.Label>
										Neutral ({numbersOfHabitsByQueries.neutral})
									</HabitScoreFilters.Neutral.Label>
								</UI.Row>
								<UI.Row mt="12" crossAxis="center">
									<HabitScoreFilters.Negative.Input
										disabled={numbersOfHabitsByQueries.negative === 0}
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.Negative.Label>
										Negative ({numbersOfHabitsByQueries.negative})
									</HabitScoreFilters.Negative.Label>
								</UI.Row>
								<UI.Row mt="12" crossAxis="center">
									<HabitScoreFilters.All.Input
										value={habitScoreFilter.value}
										onChange={habitScoreFilter.onChange}
									/>
									<HabitScoreFilters.All.Label>
										All scores ({numbersOfHabitsByQueries.all})
									</HabitScoreFilters.All.Label>
								</UI.Row>
							</UI.Column>
							<UI.Column ml="72">
								<UI.Text variant="semi-bold">Strengths</UI.Text>
								<UI.Row mt="24">
									<HabitStrengthFilters.Established.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={numbersOfHabitsByQueries.established === 0}
									/>
									<HabitStrengthFilters.Established.Label>
										Established ({numbersOfHabitsByQueries.established})
									</HabitStrengthFilters.Established.Label>
								</UI.Row>
								<UI.Row mt="12">
									<HabitStrengthFilters.Developing.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={numbersOfHabitsByQueries.developing === 0}
									/>
									<HabitStrengthFilters.Developing.Label>
										Developing ({numbersOfHabitsByQueries.developing})
									</HabitStrengthFilters.Developing.Label>
								</UI.Row>
								<UI.Row mt="12">
									<HabitStrengthFilters.Fresh.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
										disabled={numbersOfHabitsByQueries.fresh === 0}
									/>
									<HabitStrengthFilters.Fresh.Label>
										Fresh ({numbersOfHabitsByQueries.fresh})
									</HabitStrengthFilters.Fresh.Label>
								</UI.Row>
								<UI.Row mt="12">
									<HabitStrengthFilters.All.Input
										value={habitStrengthFilter.value}
										onChange={habitStrengthFilter.onChange}
									/>
									<HabitStrengthFilters.All.Label>
										All strengths ({numbersOfHabitsByQueries.all})
									</HabitStrengthFilters.All.Label>
								</UI.Row>
							</UI.Column>
							<UI.Button ml="auto" mb="auto" variant="outlined" onClick={resetAllFilters}>
								Reset filters
							</UI.Button>
						</UI.Row>
					)}

					<UI.Row mt={["48", "24"]} mainAxis="end">
						<UI.Button
							mr={["24", "12"]}
							mt={["0", "12"]}
							variant="primary"
							layout="with-icon"
							onClick={openAddFormDialog}
						>
							<PlusIcon mr="12" style={{stroke: "var(--gray-1)"}} />
							New habit
						</UI.Button>
					</UI.Row>

					<UI.Row mt="6" width="auto" crossAxis="end" wrap="wrap" mx={["24", "12"]}>
						<UI.Field mr="12">
							<UI.Label htmlFor="habit_name">Habit name</UI.Label>
							<UI.Input
								id="habit_name"
								type="search"
								placeholder="Search for habits..."
								value={habitSearch.value}
								onChange={habitSearch.onChange}
							/>
						</UI.Field>

						<UI.Button mt={["auto", "12"]} variant="outlined" onClick={habitSearch.clearPhrase}>
							Clear
						</UI.Button>

						<UI.Text mb="6" mr="12" mt="12" ml="auto" data-testid="number-of-habit-search-results">
							<UI.Text variant="bold">{numberOfHabitResults}</UI.Text> results
						</UI.Text>
					</UI.Row>

					<UI.ShowIf request={getHabitsRequestState} is="success">
						{filteredHabits.length === 0 && (
							<UI.InfoBanner size="big" mt="48" mx="24">
								It seems you haven't added any habits yet.
							</UI.InfoBanner>
						)}
					</UI.ShowIf>

					<UI.ShowIf request={getHabitsRequestState} is="error">
						<UI.ErrorBanner size="big" mt="48" mx="24">
							{errorMessage || "Cannot fetch habits, please try again"}
							<UI.Button onClick={() => getHabitsRequestState.refetch()} ml="24" variant="outlined">
								Retry
							</UI.Button>
						</UI.ErrorBanner>
					</UI.ShowIf>

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
			</UI.ShowIf>
		</UI.Column>
	);
};

function reorder(habits: Habit[], fromIndex: number, toIndex: number): Habit[] {
	const result = Array.from(habits);
	const [removed] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, removed);
	return result;
}

function getNumbersOfHabitsByQueries(habits: Habit[]) {
	function getNumberOfHabitsByScore(score: Habit["score"]): number {
		return habits.filter(habit => habit.score === score).length;
	}

	function getNumberOfHabitsByStrength(strength: Habit["strength"]): number {
		return habits.filter(habit => habit.strength === strength).length;
	}

	return {
		positive: getNumberOfHabitsByScore("positive"),
		neutral: getNumberOfHabitsByScore("neutral"),
		negative: getNumberOfHabitsByScore("negative"),
		established: getNumberOfHabitsByStrength("established"),
		developing: getNumberOfHabitsByStrength("developing"),
		fresh: getNumberOfHabitsByStrength("fresh"),
		all: habits.length,
	};
}
