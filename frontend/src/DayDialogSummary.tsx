import {isSameDay} from "date-fns";
import React from "react";

import {DayVoteStats} from "./interfaces/IMonthDay";
import {IHabit} from "./interfaces/IHabit";
import {Stat} from "./Stat";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useHabits} from "./contexts/habits-context";
import {voteToBgColor} from "./interfaces/IDayVote";

type DayDialogSummaryProps = DayVoteStats & {
	day: string;
};

export const DaySummaryChart: React.FC<DayDialogSummaryProps & JSX.IntrinsicElements["div"]> = ({
	day,
	className = "",
	...stats
}) => {
	const habits = useHabits();
	const howManyHabits = getHabitsAvailableAtThisDay(habits, day).length;

	const noVotesPercentage = Number(((stats.noVotesCountStats ?? 0) / howManyHabits) * 100).toFixed(
		2,
	);
	const regressVotesPercentage = Number(
		((stats.regressVotesCountStats ?? 0) / howManyHabits) * 100,
	).toFixed(2);
	const plateauVotesPercentage = Number(
		((stats.plateauVotesCountStats ?? 0) / howManyHabits) * 100,
	).toFixed(2);
	const progressVotesPercentage = Number(
		((stats.progressVotesCountStats ?? 0) / howManyHabits) * 100,
	).toFixed(2);

	const noVotesCellTitle = `No votes: ${stats.noVotesCountStats}/${howManyHabits} (${noVotesPercentage}%)`;
	const regressVotesCellTitle = `Regress: ${stats.regressVotesCountStats}/${howManyHabits} (${regressVotesPercentage}%)`;
	const plateauVotesCellTitle = `Plateau: ${stats.plateauVotesCountStats}/${howManyHabits} (${plateauVotesPercentage}%)`;
	const progressVotesCellTitle = `Progress: ${stats.progressVotesCountStats}/${howManyHabits} (${progressVotesPercentage}%)`;

	return (
		<div className={`flex justify-end pl-0 text-sm my-8 ${className}`}>
			<div className="flex p-1 flex-1">
				<div
					title={noVotesCellTitle}
					style={{flexBasis: `${noVotesPercentage}%`}}
					className={voteToBgColor.get(null)}
				/>
				<div
					title={regressVotesCellTitle}
					style={{flexBasis: `${regressVotesPercentage}%`}}
					className={voteToBgColor.get("regress")}
				/>
				<div
					title={plateauVotesCellTitle}
					style={{flexBasis: `${plateauVotesPercentage}%`}}
					className={voteToBgColor.get("plateau")}
				/>
				<div
					title={progressVotesCellTitle}
					style={{flexBasis: `${progressVotesPercentage}%`}}
					className={voteToBgColor.get("progress")}
				/>
			</div>
			<Stat count={stats.noVotesCountStats} sign="?" />
			<Stat count={stats.regressVotesCountStats} sign="-" />
			<Stat count={stats.plateauVotesCountStats} sign="=" />
			<Stat count={stats.progressVotesCountStats} sign="+" />
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
