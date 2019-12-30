import {Dialog} from "@reach/dialog";
import {isBefore, isSameDay} from "date-fns";
import * as Async from "react-async";
import React from "react";

import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DayVote, Vote} from "./services/calendar";
import {DialogCloseButton} from "./CloseButton";
import {IHabit} from "./interfaces/IHabit";
import {MonthDayProps} from "./hooks/useMonthsWidget";
import {Stat} from "./Stat";
import {api} from "./services/api";
import {useHabits} from "./contexts/habits-context";
import {useNotification} from "./contexts/notifications-context";

type DayDialogProps = Omit<MonthDayProps, "styles"> & {
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
	const [triggerErrorNotification] = useNotification();

	const getDayVotesRequestState = Async.useAsync({
		promiseFn: api.calendar.getDay,
		day,
		onReject: () =>
			triggerErrorNotification({
				type: "error",
				message: "Couldn't fetch habit votes.",
			}),
	});

	const habitsAddedAtThisDay = getHabitsAddedAtThisDay(habits, day);
	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, day);
	const areAnyHabitsAvailable = habitsAvailableAtThisDay.length === 0;

	return (
		<Dialog aria-label="Show day preview">
			<div className="flex justify-between items-baseline">
				<strong>{day}</strong>
				<DialogCloseButton onClick={closeDialog} />
			</div>
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul data-testid="day-dialog-habits">
				{habitsAvailableAtThisDay.map(habit => (
					<DayDialogHabitVoteListItem
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
			<div className="flex flex-end pl-0 text-sm mt-8">
				{stats.createdHabitsCount && (
					<details className="mr-auto">
						<summary title={`${stats.createdHabitsCount} habit(s) added this day`}>
							NEW: {stats.createdHabitsCount}
						</summary>
						<p>Habit(s) added this day:</p>
						<ul className="mt-2">
							{habitsAddedAtThisDay.map(habit => (
								<li key={habit.id}>{habit.name}</li>
							))}
						</ul>
					</details>
				)}
				<Stat count={stats.progressVotesCountStats} sign="+" />
				<Stat count={stats.plateauVotesCountStats} sign="=" />
				<Stat count={stats.regressVotesCountStats} sign="-" />
				<Stat count={stats.noVotesCountStats} sign="?" />
			</div>
		</Dialog>
	);
};

function getHabitsAddedAtThisDay(habits: IHabit[], day: string | Date): IHabit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});
}

function getHabitsAvailableAtThisDay(habits: IHabit[], day: string | Date): IHabit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});
}

function getDayVoteForHabit(
	getDayVotesRequestState: Async.AsyncState<DayVote[]>,
	habit: IHabit,
): Vote | undefined {
	const dayVotes = getDayVotesRequestState.data ?? [];
	return dayVotes.find(vote => vote.habit_id === habit.id)?.vote;
}
