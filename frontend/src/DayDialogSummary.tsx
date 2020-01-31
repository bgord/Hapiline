import {isSameDay} from "date-fns";
import React from "react";

import {DayVoteStats} from "./interfaces/IMonthDay";
import {IHabit} from "./interfaces/IHabit";
import {Stat} from "./Stat";
import {useHabits} from "./contexts/habits-context";
import {voteToBgColor} from "./interfaces/IDayVote";

type DayDialogSummaryProps = DayVoteStats & {
	maximumVotes: number;
};

export const DaySummaryChart: React.FC<DayDialogSummaryProps & JSX.IntrinsicElements["div"]> = ({
	maximumVotes,
	className = "",
	...stats
}) => {
	const noVotesPercentage = Number(((stats.noVotesCountStats ?? 0) / maximumVotes) * 100).toFixed(
		2,
	);
	const regressVotesPercentage = Number(
		((stats.regressVotesCountStats ?? 0) / maximumVotes) * 100,
	).toFixed(2);
	const plateauVotesPercentage = Number(
		((stats.plateauVotesCountStats ?? 0) / maximumVotes) * 100,
	).toFixed(2);
	const progressVotesPercentage = Number(
		((stats.progressVotesCountStats ?? 0) / maximumVotes) * 100,
	).toFixed(2);

	const noVotesCellTitle = `No votes: ${stats.noVotesCountStats}/${maximumVotes} (${noVotesPercentage}%)`;
	const regressVotesCellTitle = `Regress: ${stats.regressVotesCountStats}/${maximumVotes} (${regressVotesPercentage}%)`;
	const plateauVotesCellTitle = `Plateau: ${stats.plateauVotesCountStats}/${maximumVotes} (${plateauVotesPercentage}%)`;
	const progressVotesCellTitle = `Progress: ${stats.progressVotesCountStats}/${maximumVotes} (${progressVotesPercentage}%)`;

	return (
		<div className={`flex w-full ${className}`}>
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
	);
};

export const DaySummaryStats: React.FC<DayVoteStats> = ({...stats}) => (
	<>
		<Stat count={stats.noVotesCountStats} sign="?" />
		<Stat count={stats.regressVotesCountStats} sign="-" />
		<Stat count={stats.plateauVotesCountStats} sign="=" />
		<Stat count={stats.progressVotesCountStats} sign="+" />
	</>
);

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
					<li key={habit.id}>
						{habit.name} {!habit.is_trackable && <span>(not tracked)</span>}
					</li>
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
