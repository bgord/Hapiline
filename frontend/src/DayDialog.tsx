import {Dialog} from "@reach/dialog";
import {isBefore, isSameDay} from "date-fns";
import React from "react";

import {DialogCloseButton} from "./CloseButton";
import {MonthDayProps} from "./hooks/useMonthsWidget";
import {Stat} from "./Stat";
import {useHabits} from "./contexts/habits-context";

type DayDialogProps = Omit<MonthDayProps, "styles"> & {closeDialog: VoidFunction};

export const DayDialog: React.FC<DayDialogProps> = ({day, closeDialog, ...stats}) => {
	const habits = useHabits();

	const habitsAvailableAtThisDay = habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});

	const habitsAddedAtThisDay = habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});

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
					<li
						key={habit.id}
						className="flex items-baseline justify-between bg-blue-100 my-2 p-2 mt-4"
					>
						<div>{habit.name}</div>
						<div>
							<button className="py-2 px-4 bg-white" type="button">
								+
							</button>
							<button className="py-2 px-4 ml-2 bg-white" type="button">
								=
							</button>
							<button className="py-2 px-4 ml-2 bg-white" type="button">
								-
							</button>
						</div>
					</li>
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
