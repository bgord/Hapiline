import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import {CloseButton} from "./CloseButton";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DayDialogSummary} from "./DayDialogSummary";
import {DayVoteStats} from "./interfaces/IMonthDay";
import {IDayVote, Vote} from "./interfaces/IDayVote";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabits} from "./contexts/habits-context";

type DayDialogProps = DayVoteStats & {
	closeDialog: VoidFunction;
	refreshCalendar: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({
	day,
	closeDialog,
	refreshCalendar,
	...stats
}) => {
	const habits = useHabits();
	const triggerErrorNotification = useErrorNotification();

	const getDayVotesRequestState = Async.useAsync({
		promiseFn: api.calendar.getDay,
		day,
		onReject: () => triggerErrorNotification("Couldn't fetch habit votes."),
	});

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, day);

	const areAnyHabitsAvailable = habitsAvailableAtThisDay.length === 0;

	return (
		<Dialog aria-label="Show day preview">
			<div className="flex justify-between items-baseline">
				<strong>{day}</strong>
				<CloseButton onClick={closeDialog} />
			</div>
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul data-testid="day-dialog-habits">
				{habitsAvailableAtThisDay.map(habit => (
					<DayDialogHabitVoteListItem
						key={habit.id}
						habit={habit}
						day={day}
						vote={getDayVoteForHabit(getDayVotesRequestState, habit)}
						onResolve={() => {
							refreshCalendar();
							getDayVotesRequestState.reload();
						}}
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
): Vote | undefined {
	const dayVotes = getDayVotesRequestState.data ?? [];
	return dayVotes.find(vote => vote.habit_id === habit.id)?.vote;
}
