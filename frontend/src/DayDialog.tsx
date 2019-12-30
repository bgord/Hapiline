import {Dialog} from "@reach/dialog";
import {isBefore, isSameDay} from "date-fns";
import * as Async from "react-async";
import React from "react";

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
	const dayVotes = getDayVotesRequestState.data ?? [];

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
				{habitsAvailableAtThisDay.map(habit => {
					const [triggerSuccessNotification] = useNotification();
					const [triggerErrorNotification] = useNotification();

					const addHabitDayVoteRequestState = Async.useAsync({
						deferFn: api.habit.addHabitDayVote,
						onResolve: () => {
							triggerSuccessNotification({
								type: "success",
								message: "Habit vote added successfully!",
							});
							refreshCalendar();
							getDayVotesRequestState.reload();
						},
						onReject: () => {
							triggerErrorNotification({
								type: "error",
								message: "Error while changing habit vote.",
							});
						},
					});
					const habitVote = dayVotes.find(vote => vote.habit_id === habit.id)?.vote;

					const progressButtonBg = habitVote === "progress" ? "bg-green-300" : "bg-white";
					const plateauButtonBg = habitVote === "plateau" ? "bg-gray-300" : "bg-white";
					const regressButtonBg = habitVote === "regress" ? "bg-red-300" : "bg-white";

					const payload = {day: new Date(day), habit_id: habit.id};

					return (
						<li
							key={habit.id}
							className="flex items-baseline justify-between bg-blue-100 my-2 p-2 mt-4"
						>
							<span>{habit.name}</span>
							<div>
								<button
									onClick={() => {
										const nextVote = habitVote === "progress" ? null : "progress";
										addHabitDayVoteRequestState.run({...payload, vote: nextVote});
									}}
									className={`py-2 px-4 ${progressButtonBg}`}
									type="button"
									disabled={addHabitDayVoteRequestState.isPending}
								>
									+
								</button>
								<button
									onClick={() => {
										const nextVote = habitVote === "plateau" ? null : "plateau";
										addHabitDayVoteRequestState.run({...payload, vote: nextVote});
									}}
									className={`py-2 px-4 ${plateauButtonBg}`}
									type="button"
									disabled={addHabitDayVoteRequestState.isPending}
								>
									=
								</button>
								<button
									onClick={() => {
										const nextVote = habitVote === "regress" ? null : "regress";
										addHabitDayVoteRequestState.run({...payload, vote: nextVote});
									}}
									className={`py-2 px-4 ${regressButtonBg}`}
									type="button"
									disabled={addHabitDayVoteRequestState.isPending}
								>
									-
								</button>
							</div>
						</li>
					);
				})}
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
