import {Dialog} from "@reach/dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {CloseButton} from "./CloseButton";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DayDialogSummary} from "./DayDialogSummary";
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
	const habitSearch = useHabitSearch();
	const habitVoteFilter = useHabitVoteFilter();

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, day);

	const habitVotes: HabitVote[] = habitsAvailableAtThisDay.map(habit => ({
		habit,
		vote: getDayVoteForHabit(getDayVotesRequestState, habit)?.vote,
		comment: getDayVoteForHabit(getDayVotesRequestState, habit)?.comment,
		day,
	}));

	const areAnyHabitsAvailable = habitsAvailableAtThisDay.length === 0;

	const howManyHabitsAtAll = habitVotes.length;
	const howManyUnvotedHabits = habitVotes.filter(({vote}) => !vote).length;
	const howManyVotedHabits = habitVotes.filter(({vote}) => vote).length;

	const doesEveryHabitHasAVote = howManyUnvotedHabits === 0 && howManyHabitsAtAll > 0;

	function dismissDialog() {
		history.push("/calendar");
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
			<div className="flex my-8">
				<HabitVoteFilters.Voted.Input {...habitVoteFilter} disabled={howManyVotedHabits === 0} />
				<HabitVoteFilters.Voted.Label>
					Show voted ({howManyVotedHabits})
				</HabitVoteFilters.Voted.Label>

				<HabitVoteFilters.Unvoted.Input
					{...habitVoteFilter}
					disabled={howManyUnvotedHabits === 0}
				/>
				<HabitVoteFilters.Unvoted.Label>
					Show unvoted ({howManyUnvotedHabits})
				</HabitVoteFilters.Unvoted.Label>

				<HabitVoteFilters.All.Input {...habitVoteFilter} disabled={howManyHabitsAtAll === 0} />
				<HabitVoteFilters.All.Label>Show all ({howManyHabitsAtAll})</HabitVoteFilters.All.Label>

				<BareButton
					onClick={() => {
						habitVoteFilter.reset();
						habitSearch.clearPhrase();
					}}
					className="ml-auto"
				>
					Reset filters
				</BareButton>
			</div>
			<div className="mb-6">
				<HabitSearchInput {...habitSearch} />
				<BareButton onClick={habitSearch.clearPhrase}>Clear</BareButton>
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
			<DayDialogSummary day={day} {...stats} />
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
