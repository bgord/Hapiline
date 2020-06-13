import {useLocation} from "react-router-dom";
import {useQuery, QueryResult} from "react-query";
import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {ChevronUpIcon} from "./ui/icons/ChevronUp";
import {ChevronDownIcon} from "./ui/icons/ChevronDown";

import * as UI from "./ui";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DaySummaryChart, DayDialogSummaryTabs} from "./DayDialogSummary";
import {QuestionMarkIcon} from "./ui/icons/QuestionMark";
import {Habit, HabitVote, HabitWithPossibleHabitVote, DayCellWithFullStats} from "./models";
import {HabitVoteFilters, useHabitVoteFilter} from "./hooks/useHabitVoteFilter";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorToast} from "./contexts/toasts-context";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
import {useQueryParams} from "./hooks/useQueryParam";
import {useTrackedHabits} from "./contexts/habits-context";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useToggle} from "./hooks/useToggle";

type HabitTabProps = Omit<DayCellWithFullStats, "styles" | "createdHabitsCount"> & {
	onResolve: VoidFunction;
};

export const HabitTab: React.FC<HabitTabProps> = ({day, onResolve, ...stats}) => {
	useDocumentTitle(`Hapiline - ${day}`);
	const location = useLocation<{from: string | undefined}>();
	const [queryParams, updateQueryParams] = useQueryParams();

	const trackedHabits = useTrackedHabits();

	const {on: isChartLegendVisible, toggle: toggleIsChartLegendVisible} = useToggle();
	const {on: areTrackedHabitsVisible, toggle: toggleAreTrackedHabitsVisible} = useToggle(true);

	const triggerErrorToast = useErrorToast();

	const getDayVotesRequestState = useQuery<HabitVote[], ["day", string]>({
		queryKey: ["day", day],
		queryFn: api.calendar.getDay,
		config: {
			onError: () => triggerErrorToast("Couldn't fetch habit votes."),
		},
	});

	const possiblyHighlightedHabitName = trackedHabits.find(
		habit => habit.id === Number(queryParams.highlighted_habit_id),
	)?.name;

	const habitSearch = useHabitSearch(possiblyHighlightedHabitName);
	const habitVoteFilter = useHabitVoteFilter();

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(trackedHabits, day);

	const habitsWithPossibleVote: HabitWithPossibleHabitVote[] = habitsAvailableAtThisDay.map(
		habit => {
			const habitVoteForGivenDay: Nullable<HabitVote> = getDayVoteForHabit(
				getDayVotesRequestState,
				habit,
			);
			return {
				...habit,
				vote: habitVoteForGivenDay,
			};
		},
	);

	const numberOfTrackedHabits = habitsAvailableAtThisDay.length;
	const areThereNoTrackedHabits = numberOfTrackedHabits === 0;

	const numberOfHabitsAtAll = habitsWithPossibleVote.length;
	const numberOfHabitsWithoutVotes = habitsWithPossibleVote.filter(({vote}) => !vote?.vote).length;
	const numberOfHabitsWithVote = habitsWithPossibleVote.filter(({vote}) => vote?.vote).length;

	const doesEveryHabitHasVote = numberOfHabitsWithoutVotes === 0 && numberOfHabitsAtAll > 0;

	function clearHighlightedHabitId() {
		const {highlighted_habit_id, ...rest} = queryParams;
		updateQueryParams(location?.state?.from ?? location.pathname, {...rest});
	}

	const filteredHabitsWithPossibleVote = habitsWithPossibleVote
		.filter(habitVoteFilter.filterFunction)
		.filter(habitWithPossibleVote => habitSearch.filterFn(habitWithPossibleVote.name));

	return (
		<UI.Column px="24">
			{doesEveryHabitHasVote && (
				<UI.SuccessBanner mt="24">
					<UI.Text ml="12" style={{color: "#025D26"}}>
						Congratulations! You've voted for every habit.
					</UI.Text>
					<UI.Emoji ml="12" ariaLabel="Party emoji">
						{UI.labelToEmoji.party}
					</UI.Emoji>
				</UI.SuccessBanner>
			)}

			<UI.Row mt="24">
				<UI.Button
					onClick={toggleIsChartLegendVisible}
					style={{marginLeft: "-12px"}}
					mr="12"
					variant="bare"
				>
					<QuestionMarkIcon />
				</UI.Button>

				<DaySummaryChart maximumVotes={habitsAvailableAtThisDay.length} day={day} {...stats} />

				<UI.Text ml="12" style={{whiteSpace: "nowrap"}}>
					<UI.Text variant="bold">{trackedHabits.length}</UI.Text>
					{" in total"}
				</UI.Text>
			</UI.Row>

			<UI.Row mt="6" crossAxis="center">
				{isChartLegendVisible && (
					<UI.Row mb="6" mainAxis="center">
						<UI.Text style={{fontSize: "72px", color: "var(--gray-9)"}}>·</UI.Text>
						<UI.Text>no votes</UI.Text>
					</UI.Row>
				)}

				{isChartLegendVisible && (
					<UI.Row mb="6" mainAxis="center">
						<UI.Text style={{fontSize: "72px", color: "#ef8790"}}>·</UI.Text>
						<UI.Text>regress votes</UI.Text>
					</UI.Row>
				)}

				{isChartLegendVisible && (
					<UI.Row mb="6" mainAxis="center">
						<UI.Text style={{fontSize: "72px", color: "var(--gray-3)"}}>·</UI.Text>
						<UI.Text>plateau votes</UI.Text>
					</UI.Row>
				)}

				{isChartLegendVisible && (
					<UI.Row mb="6" mainAxis="center">
						<UI.Text style={{fontSize: "72px", color: "#8bdb90"}}>·</UI.Text>
						<UI.Text>progress votes</UI.Text>
					</UI.Row>
				)}
			</UI.Row>

			<UI.Row mt="48" crossAxis="center">
				<HabitVoteFilters.Voted.Input
					value={habitVoteFilter.value}
					onChange={habitVoteFilter.onChange}
					disabled={numberOfHabitsWithVote === 0}
				/>
				<HabitVoteFilters.Voted.Label>
					Show voted ({numberOfHabitsWithVote})
				</HabitVoteFilters.Voted.Label>

				<HabitVoteFilters.Unvoted.Input
					value={habitVoteFilter.value}
					onChange={habitVoteFilter.onChange}
					disabled={numberOfHabitsWithoutVotes === 0}
				/>
				<HabitVoteFilters.Unvoted.Label>
					Show unvoted ({numberOfHabitsWithoutVotes})
				</HabitVoteFilters.Unvoted.Label>

				<HabitVoteFilters.All.Input
					value={habitVoteFilter.value}
					onChange={habitVoteFilter.onChange}
				/>
				<HabitVoteFilters.All.Label>Show all ({numberOfHabitsAtAll})</HabitVoteFilters.All.Label>

				<UI.Button
					ml="auto"
					onClick={() => {
						habitVoteFilter.reset();
						habitSearch.clearPhrase();
						updateQueryParams(location.state?.from ?? location.pathname, {
							preview_day: queryParams.preview_day,
							subview: "day_preview",
						});
					}}
					variant="outlined"
				>
					Reset filters
				</UI.Button>
			</UI.Row>
			<UI.Row mt="24" crossAxis="end">
				<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />

				<UI.Button
					ml="12"
					onClick={() => {
						habitSearch.clearPhrase();
						clearHighlightedHabitId();
					}}
					variant="outlined"
				>
					Clear
				</UI.Button>

				<UI.Text ml="auto" data-testid="number-of-habit-search-results">
					<UI.Text variant="bold">{filteredHabitsWithPossibleVote.length}</UI.Text> results
				</UI.Text>
			</UI.Row>

			{areThereNoTrackedHabits && (
				<UI.InfoBanner size="big" mt="48">
					No habits available this day.
				</UI.InfoBanner>
			)}

			{!areThereNoTrackedHabits && filteredHabitsWithPossibleVote.length > 0 && (
				<UI.Column pb="48">
					<UI.Row mainAxis="between" crossAxis="center" mt="48" mb="24">
						<UI.Header variant="extra-small">Tracked habits</UI.Header>

						{areTrackedHabitsVisible && (
							<UI.Button
								variant="bare"
								title="Hide tracked habits"
								onClick={toggleAreTrackedHabitsVisible}
							>
								<VisuallyHidden>Hide tracked habits</VisuallyHidden>
								<ChevronUpIcon />
							</UI.Button>
						)}

						{!areTrackedHabitsVisible && (
							<UI.Button
								variant="bare"
								title="Show tracked habits"
								onClick={toggleAreTrackedHabitsVisible}
							>
								<VisuallyHidden>Show tracked habits</VisuallyHidden>
								<ChevronDownIcon />
							</UI.Button>
						)}
					</UI.Row>

					{areTrackedHabitsVisible && (
						<UI.Column as="ul" bt="gray-1" data-testid="day-dialog-habits">
							{filteredHabitsWithPossibleVote.map(entry => (
								<DayDialogHabitVoteListItem
									day={day}
									key={entry.id}
									onResolve={() => {
										onResolve();
										getDayVotesRequestState.refetch({force: true});
									}}
									{...entry}
								/>
							))}
						</UI.Column>
					)}

					<DayDialogSummaryTabs day={day} />
				</UI.Column>
			)}
		</UI.Column>
	);
};

function getDayVoteForHabit(
	getDayVotesRequestState: QueryResult<HabitVote[]>,
	habit: Habit,
): Nullable<HabitVote> {
	const votesFromGivenDay = getDayVotesRequestState.data ?? [];

	return votesFromGivenDay.find(vote => vote.habit_id === habit.id) ?? null;
}
