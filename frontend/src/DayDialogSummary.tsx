import {isSameDay} from "date-fns";
import React from "react";

import {DayVoteStats} from "./interfaces/IMonthDay";
import {IHabit} from "./interfaces/IHabit";
import {Stat} from "./Stat";
import {useHabits} from "./contexts/habits-context";

type DayDialogSummaryProps = DayVoteStats & {
	day: string;
};

export const DayDialogSummary: React.FC<DayDialogSummaryProps> = props => {
	return (
		<div className="flex justify-end pl-0 text-sm my-8">
			<Stat count={props.progressVotesCountStats} sign="+" />
			<Stat count={props.plateauVotesCountStats} sign="=" />
			<Stat count={props.regressVotesCountStats} sign="-" />
			<Stat count={props.noVotesCountStats} sign="?" />
		</div>
	);
};

export const HabitsAddedAtGivenDay: React.FC<DayDialogSummaryProps> = ({day, ...stats}) => {
	const habits = useHabits();
	const habitsAddedAtThisDay = getHabitsAddedAtThisDay(habits, day);

	const summaryTitle = `${stats.createdHabitsCount} habit(s) added this day`;
	return (
		<details className="text-sm my-8" hidden={!stats.createdHabitsCount}>
			<summary title={summaryTitle}>NEW: {stats.createdHabitsCount}</summary>
			<p>Habit(s) added this day:</p>
			<ul className="mt-2">
				{habitsAddedAtThisDay.map(habit => (
					<li key={habit.id}>{habit.name}</li>
				))}
			</ul>
		</details>
	);
};

function getHabitsAddedAtThisDay(habits: IHabit[], day: string | Date): IHabit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});
}
