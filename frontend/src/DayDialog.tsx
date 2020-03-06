import {Dialog} from "@reach/dialog";
import {useLocation} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button, Row, Header, Text, CloseIcon, Column, Banner} from "./ui";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {
	DaySummaryChart,
	DaySummaryStats,
	HabitsAddedAtGivenDay,
	UntrackedHabits,
} from "./DayDialogSummary";
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

type DayDialogProps = DayVoteStats & {
	onResolve?: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, onResolve, ...stats}) => {
	const location = useLocation<{from: string | undefined}>();
	const trackedHabits = useTrackedHabits();

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
			className="max-w-screen-lg overflow-auto"
			style={{maxHeight: "700px", paddingBottom: "48px"}}
		>
			<Row p="24" mainAxis="between" style={{background: "var(--gray-1)"}}>
				<Header variant="small">
					{day} - {dayName}
				</Header>
				<CloseIcon onClick={dismissDialog} />
			</Row>
			<Column px="24">
				{doesEveryHabitHasAVote && (
					<Banner p="6" mt="24" variant="success">
						<Text style={{color: "#025D26"}}>
							<span data-mx="12" role="img" aria-label="Party emoji">
								🎉
							</span>
							Congratulations! You've voted for every habit.
						</Text>
					</Banner>
				)}
				<Row mt="48">
					<DaySummaryChart
						maximumVotes={habitsAvailableAtThisDay.length}
						className="h-4"
						day={day}
						{...stats}
					/>
					<DaySummaryStats day={day} {...stats} />
				</Row>
				<Row mt="48" crossAxis="center">
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

					<Button
						ml="auto"
						onClick={() => {
							habitVoteFilter.reset();
							habitSearch.clearPhrase();
							updateQueryParams(location.state.from ?? location.pathname, {
								preview_day: queryParams.preview_day,
								subview: "day_preview",
							});
						}}
						variant="outlined"
					>
						Reset filters
					</Button>
				</Row>
				<Row mt="24" crossAxis="end">
					<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />
					<Button
						ml="12"
						onClick={() => {
							habitSearch.clearPhrase();
							clearHighlightedHabitId();
						}}
						variant="outlined"
					>
						Clear
					</Button>
					<Text ml="auto" data-testid="habit-search-result-count">
						<Text variant="bold">{filteredHabitVotes.length}</Text> results
					</Text>
				</Row>
				{isThereNoTrackedHabits && <div>No habits available this day.</div>}
				{!isThereNoTrackedHabits && filteredHabitVotes.length > 0 && (
					<Column pb="48">
						<Header mt="48" mb="24" variant="extra-small">
							Tracked habits
						</Header>
						<ul data-testid="day-dialog-habits" style={{borderTop: "1px solid var(--gray-1)"}}>
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
						</ul>
						<HabitsAddedAtGivenDay
							maximumVotes={habitsAvailableAtThisDay.length}
							day={day}
							{...stats}
						/>
						<UntrackedHabits day={day} />
					</Column>
				)}
			</Column>
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
