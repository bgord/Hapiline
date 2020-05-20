import {Dialog} from "@reach/dialog";
import {useLocation} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DaySummaryChart, DayDialogSummaryTabs} from "./DayDialogSummary";
import {QuestionMarkIcon} from "./ui/icons/QuestionMark";
import {DayVoteStats} from "./interfaces/IMonthDay";
import {HabitVote, IHabit} from "./interfaces/IHabit";
import {HabitVoteFilters, useHabitVoteFilter} from "./hooks/useHabitVoteFilter";
import {IDayVote} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
import {useQueryParams} from "./hooks/useQueryParam";
import {useTrackedHabits} from "./contexts/habits-context";
import {format} from "date-fns";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useToggle} from "./hooks/useToggle";

type DayDialogProps = DayVoteStats & {
	onResolve?: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, onResolve, ...stats}) => {
	useDocumentTitle(`Hapiline - ${day}`);
	const location = useLocation<{from: string | undefined}>();
	const trackedHabits = useTrackedHabits();
	const [isChartLegendVisible, , , toggleIsChartLegendVisible] = useToggle();

	const triggerErrorNotification = useErrorNotification();
	const getDayVotesRequestState = Async.useAsync({
		promiseFn: api.calendar.getDay,
		day,
		onReject: () => triggerErrorNotification("Couldn't fetch habit votes."),
	});

	const [queryParams, updateQueryParams] = useQueryParams();
	const highlightedHabitId = queryParams.highlighted_habit_id;

	const possiblyHighlightedHabitName = trackedHabits.find(
		habit => habit.id === Number(highlightedHabitId),
	)?.name;

	const habitSearch = useHabitSearch(possiblyHighlightedHabitName);
	const habitVoteFilter = useHabitVoteFilter();

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(trackedHabits, day);

	const habitVotes: HabitVote[] = habitsAvailableAtThisDay.map(habit => {
		const voteForHabit = getDayVoteForHabit(getDayVotesRequestState, habit);
		return {
			habit,
			day,
			vote: voteForHabit?.vote,
			comment: voteForHabit?.comment,
			vote_id: voteForHabit?.vote_id,
		};
	});

	const isThereNoTrackedHabits = habitsAvailableAtThisDay.length === 0;

	const howManyHabitsAtAll = habitVotes.length;
	const howManyUnvotedHabits = habitVotes.filter(({vote}) => !vote).length;
	const howManyVotedHabits = habitVotes.filter(({vote}) => vote).length;

	const doesEveryHabitHasAVote = howManyUnvotedHabits === 0 && howManyHabitsAtAll > 0;

	function dismissDialog() {
		updateQueryParams(location?.state?.from ?? location.pathname, {});
	}

	function clearHighlightedHabitId() {
		const {highlighted_habit_id, ...rest} = queryParams;
		updateQueryParams(location?.state?.from ?? location.pathname, {...rest});
	}

	const dayName = format(new Date(day), "iiii");

	const filteredHabitVotes = habitVotes
		.filter(habitVoteFilter.filterFunction)
		.filter(entry => habitSearch.filterFn(entry.habit));

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
						<UI.Row mb="6">
							<UI.Text style={{fontSize: "72px", color: "var(--gray-9)"}}>·</UI.Text>
							<UI.Text>no votes</UI.Text>
						</UI.Row>
					)}
					{isChartLegendVisible && (
						<UI.Row mb="6">
							<UI.Text style={{fontSize: "72px", color: "#ef8790"}}>·</UI.Text>
							<UI.Text>regress votes</UI.Text>
						</UI.Row>
					)}
					{isChartLegendVisible && (
						<UI.Row mb="6">
							<UI.Text style={{fontSize: "72px", color: "var(--gray-3)"}}>·</UI.Text>
							<UI.Text>plateau votes</UI.Text>
						</UI.Row>
					)}
					{isChartLegendVisible && (
						<UI.Row mb="6">
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
						<UI.Text variant="bold">{filteredHabitVotes.length}</UI.Text> results
					</UI.Text>
				</UI.Row>
				{isThereNoTrackedHabits && (
					<UI.InfoBanner size="big" mt="48">
						No habits available this day.
					</UI.InfoBanner>
				)}
				{!isThereNoTrackedHabits && filteredHabitVotes.length > 0 && (
					<UI.Column pb="48">
						<UI.Header mt="48" mb="24" variant="extra-small">
							Tracked habits
						</UI.Header>
						<UI.Column as="ul" bt="gray-1" data-testid="day-dialog-habits">
							{filteredHabitVotes.map(entry => (
								<DayDialogHabitVoteListItem
									key={entry.habit.id}
									onResolve={() => {
										if (onResolve) {
											onResolve();
										}
										getDayVotesRequestState.reload();
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
	getDayVotesRequestState: Async.AsyncState<IDayVote[]>,
	habit: IHabit,
): IDayVote | undefined {
	const dayVotes = getDayVotesRequestState.data ?? [];
	return dayVotes.find(vote => vote.habit_id === habit.id);
}
