import {isSameDay} from "date-fns";
import React from "react";

import {DayVoteStats} from "./interfaces/IMonthDay";
import {IHabit} from "./interfaces/IHabit";
import {Stat} from "./Stat";
import {useHabits} from "./contexts/habits-context";

type DayDialogSummaryProps = DayVoteStats & {
	day: string;
};

export const DayDialogSummary: React.FC<DayDialogSummaryProps> = ({day, ...stats}) => {
	const habits = useHabits();
	const habitsAddedAtThisDay = getHabitsAddedAtThisDay(habits, day);

	const summaryTitle = `${stats.createdHabitsCount} habit(s) added this day`;

	return (
		<div className="flex justify-end pl-0 text-sm mt-8">
			<details className="mr-auto" hidden={!stats.createdHabitsCount}>
				<summary title={summaryTitle}>NEW: {stats.createdHabitsCount}</summary>
				<p>Habit(s) added this day:</p>
				<ul className="mt-2">
					{habitsAddedAtThisDay.map(habit => (
						<li key={habit.id}>{habit.name}</li>
					))}
				</ul>
			</details>
			<Stat count={stats.progressVotesCountStats} sign="+" />
			<Stat count={stats.plateauVotesCountStats} sign="=" />
			<Stat count={stats.regressVotesCountStats} sign="-" />
			<Stat count={stats.noVotesCountStats} sign="?" />
		</div>
	);
};

function getHabitsAddedAtThisDay(habits: IHabit[], day: string | Date): IHabit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});
}
