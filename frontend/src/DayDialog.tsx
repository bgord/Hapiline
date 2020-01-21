import {Dialog} from "@reach/dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {CloseButton} from "./CloseButton";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DaySummaryChart, HabitsAddedAtGivenDay, DaySummaryStats} from "./DayDialogSummary";
import {DayVoteStats} from "./interfaces/IMonthDay";
import {HabitVote, IHabit} from "./interfaces/IHabit";
import {IDayVote} from "./interfaces/IDayVote";
import {SuccessMessage} from "./SuccessMessages";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabitSearch, HabitSearchInput} from "./hooks/useHabitSearch";
import {useHabitVoteFilter, HabitVoteFilters} from "./hooks/useHabitVoteFilter";
import {useHabits} from "./contexts/habits-context";
import {useQueryParams} from "./hooks/useQueryParam";

type DayDialogProps = DayVoteStats & {
	refreshCalendar: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, refreshCalendar, ...stats}) => {
	const history = useHistory();
	const habits = useHabits();
	const triggerErrorNotification = useErrorNotification();
	const getDayVotesRequestState = Async.useAsync({
		promiseFn: api.calendar.getDay,
		day,
		onReject: () => triggerErrorNotification("Couldn't fetch habit votes."),
	});

	const [queryParams, updateQueryParams] = useQueryParams();
	const highlightedHabitId = queryParams.highlighted_habit_id;

	const possiblyHighlightedHabitName = habits.find(habit => habit.id === Number(highlightedHabitId))
		?.name;

	const habitSearch = useHabitSearch(possiblyHighlightedHabitName);
	const habitVoteFilter = useHabitVoteFilter();

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, day);

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

	const areAnyHabitsAvailable = habitsAvailableAtThisDay.length === 0;

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

	return (
		<Dialog
			aria-label="Show day preview"
			onDismiss={dismissDialog}
			className="overflow-auto"
			style={{
				maxWidth: "1000px",
				maxHeight: "700px",
			}}
		>
			<div className="flex justify-between items-baseline">
				<strong>{day}</strong>
				<CloseButton onClick={dismissDialog} />
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
				<DaySummaryChart className="h-4" day={day} {...stats} />
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
						clearHighlightedHabitId();
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
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul data-testid="day-dialog-habits">
				{habitVotes
					.filter(habitVoteFilter.filterFunction)
					.filter(entry => habitSearch.filterFn(entry.habit))
					.map(entry => (
						<DayDialogHabitVoteListItem
							key={entry.habit.id}
							onResolve={() => {
								refreshCalendar();
								getDayVotesRequestState.reload();
							}}
							{...entry}
						/>
					))}
			</ul>
			<HabitsAddedAtGivenDay day={day} {...stats} />
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
