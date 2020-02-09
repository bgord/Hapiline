import {Dialog} from "@reach/dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {CloseButton} from "./CloseButton";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {
	DaySummaryChart,
	DaySummaryStats,
	HabitsAddedAtGivenDay,
	UntrackedHabits,
} from "./DayDialogSummary";
import {DayVoteStats} from "./interfaces/IMonthDay";
import {HabitVote, IHabit} from "./interfaces/IHabit";
import {HabitVoteFilters} from "./hooks/useHabitVoteFilter";
import {IDayVote} from "./interfaces/IDayVote";
import {SuccessMessage} from "./SuccessMessages";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
import {useHabitVoteFilter} from "./hooks/useHabitVoteFilter";
import {useQueryParams} from "./hooks/useQueryParam";
import {useTrackedHabits} from "./contexts/habits-context";
import {format} from "date-fns";

type DayDialogProps = DayVoteStats & {
	onResolve?: VoidFunction;
	onDismiss?: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, onResolve, onDismiss, ...stats}) => {
	const history = useHistory();
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
		history.push("/calendar");
	}

	function clearHighlightedHabitId() {
		const {highlighted_habit_id, ...rest} = queryParams;
		updateQueryParams("calendar", {...rest});
	}

	const dayName = format(new Date(day), "iiii");

	return (
		<Dialog
			aria-label="Show day preview"
			onDismiss={onDismiss || dismissDialog}
			className="overflow-auto"
			style={{
				maxWidth: "1000px",
				maxHeight: "700px",
			}}
		>
			<div className="flex justify-between items-baseline">
				<strong>
					{day} - {dayName}
				</strong>
				<CloseButton onClick={onDismiss || dismissDialog} />
			</div>
			{doesEveryHabitHasAVote && (
				<SuccessMessage>
					Congratulations! You've voted for every habit{" "}
					<span role="img" aria-label="Party emoji">
						🎉
					</span>
				</SuccessMessage>
			)}
			<div className="flex mt-6 items-center">
				<DaySummaryChart
					maximumVotes={habitsAvailableAtThisDay.length}
					className="h-4"
					day={day}
					{...stats}
				/>
				<DaySummaryStats day={day} {...stats} />
			</div>
			<div className="flex my-8">
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

				<BareButton
					onClick={() => {
						habitVoteFilter.reset();
						habitSearch.clearPhrase();
						updateQueryParams("calendar", {preview_day: queryParams.preview_day});
					}}
					className="ml-auto"
				>
					Reset filters
				</BareButton>
			</div>
			<div className="mb-6">
				<HabitSearchInput value={habitSearch.value} onChange={habitSearch.onChange} />
				<BareButton
					onClick={() => {
						habitSearch.clearPhrase();
						clearHighlightedHabitId();
					}}
				>
					Clear
				</BareButton>
			</div>
			{isThereNoTrackedHabits && <div>No habits available this day.</div>}
			{!isThereNoTrackedHabits && (
				<>
					<strong className="mt-2">Tracked habits</strong>
					<ul data-testid="day-dialog-habits">
						{habitVotes
							.filter(habitVoteFilter.filterFunction)
							.filter(entry => habitSearch.filterFn(entry.habit))
							.map(entry => (
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
				</>
			)}
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
