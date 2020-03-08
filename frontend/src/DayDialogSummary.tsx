import {isSameDay} from "date-fns";
import {Tabs, TabList, Tab, TabPanels, TabPanel} from "@reach/tabs";
import React from "react";

import {DayVoteStats} from "./interfaces/IMonthDay";
import {IHabit} from "./interfaces/IHabit";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useHabits, useUntrackedHabits} from "./contexts/habits-context";
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
		<div style={{height: "18px", fontSize: "14px"}} className={`flex w-full ${className}`}>
			<div
				title={noVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${noVotesPercentage}%`,
					backgroundColor: voteToBgColor.get(null),
					fontWeight: "bold",
					color: "var(--gray-3)",
					padding: `0 ${stats.noVotesCountStats ? 3 : 0}px`,
				}}
			>
				{stats.noVotesCountStats > 0 && stats.noVotesCountStats}
			</div>
			<div
				title={regressVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${regressVotesPercentage}%`,
					backgroundColor: voteToBgColor.get("regress"),
					fontWeight: "bold",
					color: "#720A13",
					padding: "0 3px",
				}}
			>
				{stats.regressVotesCountStats ?? 0}
			</div>
			<div
				title={plateauVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${plateauVotesPercentage}%`,
					backgroundColor: voteToBgColor.get("plateau"),
					fontWeight: "bold",
					color: "var(--gray-9)",
					padding: "0 3px",
				}}
			>
				{stats.plateauVotesCountStats ?? 0}
			</div>
			<div
				title={progressVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${progressVotesPercentage}%`,
					background: voteToBgColor.get("progress"),
					fontWeight: "bold",
					color: "#106015",
					padding: "0 3px",
				}}
			>
				{stats.progressVotesCountStats ?? 0}
			</div>
		</div>
	);
};

export const HabitsAddedAtGivenDay: React.FC<DayDialogSummaryProps> = ({day, ...stats}) => {
	const habits = useHabits();
	const habitsAddedAtThisDay = getHabitsAddedAtThisDay(habits, day);

	const summaryTitle = `${stats.createdHabitsCount} habit(s) added this day`;

	return (
		<Tabs data-mt="24" defaultIndex={-1}>
			<TabList>
				<Tab>New habits</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					{habitsAddedAtThisDay.length === 0 && <div>No habits added this day.</div>}
					{habitsAddedAtThisDay.length === 1 && <div>One habit added this day.</div>}
					{habitsAddedAtThisDay.length > 1 && (
						<div>{habitsAddedAtThisDay.length} habits added this day.</div>
					)}
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

export const UntrackedHabits: React.FC<{day: string}> = ({day}) => {
	const _untrackedHabits = useUntrackedHabits();
	const untrackedHabits = getHabitsAvailableAtThisDay(_untrackedHabits, day);

	const summaryTitle = `You have ${untrackedHabits.length} untracked habits.`;

	return (
		<details className="text-sm mb-8 mt-6" hidden={!untrackedHabits.length}>
			<summary className="c-header c-header--extra-small" title={summaryTitle}>
				Untracked habits: {untrackedHabits.length}
			</summary>
			<p>Untracked habits available at this day:</p>
			<ul className="mt-2">
				{untrackedHabits.map(habit => (
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
