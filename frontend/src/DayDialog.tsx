import {Dialog} from "@reach/dialog";
import {useLocation} from "react-router-dom";
import {useQuery, QueryResult} from "react-query";
import React from "react";

import * as UI from "./ui";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DaySummaryChart, DayDialogSummaryTabs} from "./DayDialogSummary";
import {QuestionMarkIcon} from "./ui/icons/QuestionMark";
import {
	Habit,
	HabitVote,
	HabitWithPossibleHabitVote,
	DayCellWithFullStats,
} from "./interfaces/index";
import {HabitVoteFilters, useHabitVoteFilter} from "./hooks/useHabitVoteFilter";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorToast} from "./contexts/toasts-context";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
import {useQueryParams} from "./hooks/useQueryParam";
import {useTrackedHabits} from "./contexts/habits-context";
import {format} from "date-fns";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useToggle} from "./hooks/useToggle";

type DayDialogProps = Omit<
	DayCellWithFullStats,
	"styles" | "createdHabitsCount" | "nullVotesCountStats"
> & {
	onResolve: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, onResolve, ...stats}) => {
	useDocumentTitle(`Hapiline - ${day}`);
	const location = useLocation<{from: string | undefined}>();
	const trackedHabits = useTrackedHabits();
	const [isChartLegendVisible, , , toggleIsChartLegendVisible] = useToggle();

	const triggerErrorNotification = useErrorToast();

	const getDayVotesRequestState = useQuery<HabitVote[], ["day", Date]>({
		queryKey: ["day", new Date(day)],
		queryFn: api.calendar.getDay,
		config: {
			onError: () => triggerErrorNotification("Couldn't fetch habit votes."),
		},
	});

	const [queryParams, updateQueryParams] = useQueryParams();
	const highlightedHabitId = queryParams.highlighted_habit_id;

	const possiblyHighlightedHabitName = trackedHabits.find(
		habit => habit.id === Number(highlightedHabitId),
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

	const isThereNoTrackedHabits = habitsAvailableAtThisDay.length === 0;

	const howManyHabitsAtAll = habitsWithPossibleVote.length;
	const howManyUnvotedHabits = habitsWithPossibleVote.filter(({vote}) => !vote?.vote).length;
	const howManyVotedHabits = habitsWithPossibleVote.filter(({vote}) => vote?.vote).length;

	const doesEveryHabitHasAVote = howManyUnvotedHabits === 0 && howManyHabitsAtAll > 0;

	function dismissDialog() {
		updateQueryParams(location?.state?.from ?? location.pathname, {});
	}

	function clearHighlightedHabitId() {
		const {highlighted_habit_id, ...rest} = queryParams;
		updateQueryParams(location?.state?.from ?? location.pathname, {...rest});
	}

	const dayName = format(new Date(day), "iiii");

	const filteredHabitsWithPossibleVote = habitsWithPossibleVote
		.filter(habitVoteFilter.filterFunction)
		.filter(habitWithPossibleVote => habitSearch.filterFn(habitWithPossibleVote.name));

	return (
		<Dialog
			aria-label="Show day preview"
			onDismiss={dismissDialog}
			style={{maxHeight: "700px", paddingBottom: "48px", overflow: "auto"}}
		>
			<UI.Row bg="gray-1" p="24" mainAxis="between">
				<UI.Header variant="small">
					{day} - {dayName}
				</UI.Header>
				<UI.CloseIcon onClick={dismissDialog} />
			</UI.Row>
			<UI.Column px="24">
				{doesEveryHabitHasAVote && (
					<UI.SuccessBanner mt="24">
						<UI.Text ml="12" style={{color: "#025D26"}}>
							Congratulations! You've voted for every habit.
						</UI.Text>
						<UI.Emoji ml="12" ariaLabel="Party emoji">
							{UI.labelToEmoji.party}
						</UI.Emoji>
					</UI.SuccessBanner>
				)}
				<UI.Row mt="48">
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
						disabled={howManyVotedHabits === 0}
					/>
					<HabitVoteFilters.Voted.Label>
						Show voted ({howManyVotedHabits})
					</HabitVoteFilters.Voted.Label>

					<HabitVoteFilters.Unvoted.Input
						value={habitVoteFilter.value}
						onChange={habitVoteFilter.onChange}
						disabled={howManyUnvotedHabits === 0}
					/>
					<HabitVoteFilters.Unvoted.Label>
						Show unvoted ({howManyUnvotedHabits})
					</HabitVoteFilters.Unvoted.Label>

					<HabitVoteFilters.All.Input
						value={habitVoteFilter.value}
						onChange={habitVoteFilter.onChange}
					/>
					<HabitVoteFilters.All.Label>Show all ({howManyHabitsAtAll})</HabitVoteFilters.All.Label>

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
					<UI.Text ml="auto" data-testid="habit-search-result-count">
						<UI.Text variant="bold">{filteredHabitsWithPossibleVote.length}</UI.Text> results
					</UI.Text>
				</UI.Row>
				{isThereNoTrackedHabits && (
					<UI.InfoBanner size="big" mt="48">
						No habits available this day.
					</UI.InfoBanner>
				)}
				{!isThereNoTrackedHabits && filteredHabitsWithPossibleVote.length > 0 && (
					<UI.Column pb="48">
						<UI.Header mt="48" mb="24" variant="extra-small">
							Tracked habits
						</UI.Header>
						<UI.Column as="ul" bt="gray-1" data-testid="day-dialog-habits">
							{filteredHabitsWithPossibleVote.map(entry => (
								<DayDialogHabitVoteListItem
									day={day}
									key={entry.id}
									onResolve={() => {
										onResolve();
										getDayVotesRequestState.refetch();
									}}
									{...entry}
								/>
							))}
						</UI.Column>
						<DayDialogSummaryTabs day={day} />
					</UI.Column>
				)}
			</UI.Column>
		</Dialog>
	);
};

function getDayVoteForHabit(
	getDayVotesRequestState: QueryResult<HabitVote[]>,
	habit: Habit,
): Nullable<HabitVote> {
	const votesFromGivenDay = getDayVotesRequestState.data ?? [];

	return votesFromGivenDay.find(vote => vote.habit_id === habit.id) ?? null;
}
