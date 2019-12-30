import {Dialog} from "@reach/dialog";
import {isBefore, isSameDay} from "date-fns";
import React from "react";

import {CloseButton} from "./CloseButton";
import {MonthDayProps} from "./hooks/useMonthsWidget";
import {useHabits} from "./contexts/habits-context";

type DayDialogProps = Omit<MonthDayProps, "styles"> & {closeDialog: VoidFunction};

export const DayDialog: React.FC<DayDialogProps> = ({day, closeDialog, ...stats}) => {
	const habits = useHabits();

	const habitsAvailableAtGivenDay = habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});

	const habitsAddedAtGivenDay = habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});

	const areAnyHabitsAvailable = habitsAvailableAtGivenDay.length === 0;

	return (
		<Dialog aria-label="Show day preview">
			<div className="flex justify-between items-baseline">
				<strong>{day}</strong>
				<CloseButton onClick={closeDialog} />
			</div>
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul data-testid="day-dialog-habits">
				{habitsAvailableAtGivenDay.map(habit => (
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
			<div className="flex pl-0 text-sm mt-8">
				{stats.createdHabitsCount && (
					<details>
						<summary title={`${stats.createdHabitsCount} habit(s) added this day`}>
							NEW: {stats.createdHabitsCount}
						</summary>
						<p>Habit(s) added this day:</p>
						<ul className="mt-2">
							{habitsAddedAtGivenDay.map(habit => (
								<li key={habit.id}>{habit.name}</li>
							))}
						</ul>
					</details>
				)}
				{stats.progressVotesCountStats !== undefined && (
					<span className="ml-2 bg-green-200 px-2 self-start">
						+{stats.progressVotesCountStats}
					</span>
				)}
				{stats.plateauVotesCountStats !== undefined && (
					<span className="ml-2 bg-green-200 px-2 self-start">={stats.plateauVotesCountStats}</span>
				)}
				{stats.regressVotesCountStats !== undefined && (
					<span className="ml-2 bg-green-200 px-2 self-start">-{stats.regressVotesCountStats}</span>
				)}
				{stats.nullVotesCountStats !== undefined && (
					<span className="ml-2 bg-green-200 px-2 self-start">?{stats.nullVotesCountStats}</span>
				)}
			</div>
		</Dialog>
	);
};
