import {isSameDay} from "date-fns";
import {Tabs, TabList, Tab, TabPanels, TabPanel} from "@reach/tabs";
import {Text, Row, Badge, Column} from "./ui/";
import React from "react";
import {Link} from "react-router-dom";

import {DayVoteStats} from "./interfaces/IMonthDay";
import {IHabit, habitStrengthToBadgeVariant} from "./interfaces/IHabit";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useHabits, useUntrackedHabits} from "./contexts/habits-context";
import {voteToBgColor} from "./interfaces/IDayVote";
import {constructUrl} from "./hooks/useQueryParam";

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
				data-py="0"
				data-px="3"
				title={regressVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${regressVotesPercentage}%`,
					backgroundColor: voteToBgColor.get("regress"),
					fontWeight: "bold",
					color: "#720A13",
				}}
			>
				{stats.regressVotesCountStats ?? 0}
			</div>
			<div
				data-py="0"
				data-px="3"
				title={plateauVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${plateauVotesPercentage}%`,
					backgroundColor: voteToBgColor.get("plateau"),
					fontWeight: "bold",
					color: "var(--gray-9)",
				}}
			>
				{stats.plateauVotesCountStats ?? 0}
			</div>
			<div
				data-py="0"
				data-px="3"
				title={progressVotesCellTitle}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexBasis: `${progressVotesPercentage}%`,
					background: voteToBgColor.get("progress"),
					fontWeight: "bold",
					color: "#106015",
				}}
			>
				{stats.progressVotesCountStats ?? 0}
			</div>
		</div>
	);
};

export const DayDialogSummaryTabs: React.FC<{day: string}> = ({day}) => {
	const habits = useHabits();
	const habitsAddedAtThisDay = getHabitsAddedAtThisDay(habits, day);

	const _untrackedHabits = useUntrackedHabits();
	const untrackedHabits = getHabitsAvailableAtThisDay(_untrackedHabits, day);

	return (
		<Tabs data-mt="48" defaultIndex={-1}>
			<TabList>
				<Tab data-variant="bare" className="c-button">
					Show new habits
				</Tab>
				<Tab data-variant="bare" className="c-button" data-ml="12">
					Show untracked habits
				</Tab>
			</TabList>
			<TabPanels data-mt="12">
				<TabPanel>
					{habitsAddedAtThisDay.length === 0 && <Text>No habits added this day.</Text>}
					{habitsAddedAtThisDay.length === 1 && (
						<Text>
							<Text variant="bold">One</Text> habit added this day.
						</Text>
					)}
					{habitsAddedAtThisDay.length > 1 && (
						<Text>
							<Text variant="bold">{habitsAddedAtThisDay.length}</Text> habits added this day.
						</Text>
					)}
					<Column
						style={{
							borderTop: habitsAddedAtThisDay.length > 0 ? `1px solid var(--gray-1)` : undefined,
						}}
						mt="24"
					>
						{habitsAddedAtThisDay.map(habit => (
							<Row
								py="12"
								style={{
									borderTop: "1px solid var(--gray-1)",
									borderBottom: "1px solid var(--gray-1)",
								}}
							>
								<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
									<Text variant="semi-bold">{habit.name}</Text>
								</Link>
								<Badge ml="auto" variant={habit.score}>
									{habit.score}
								</Badge>
								<Badge ml="12" variant={habitStrengthToBadgeVariant[habit.strength]}>
									{habit.strength}
								</Badge>
								{!habit.is_trackable && (
									<Badge ml="12" variant="neutral">
										Untracked
									</Badge>
								)}
							</Row>
						))}
					</Column>
				</TabPanel>
				<TabPanel>
					{untrackedHabits.length === 0 && <Text>No untracked habit available this day.</Text>}
					{untrackedHabits.length === 1 && (
						<Text>
							<Text variant="bold">One</Text> untracked habit available this day.
						</Text>
					)}
					{untrackedHabits.length > 1 && (
						<Text>{useUntrackedHabits.length} untracked habit available this day.</Text>
					)}
					<Column
						style={{
							borderTop: untrackedHabits.length > 0 ? `1px solid var(--gray-1)` : undefined,
						}}
						mt="24"
					>
						{untrackedHabits.map(habit => (
							<Row
								py="12"
								style={{
									borderTop: "1px solid var(--gray-1)",
									borderBottom: "1px solid var(--gray-1)",
								}}
							>
								<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
									<Text variant="semi-bold">{habit.name}</Text>
								</Link>
								<Badge ml="auto" variant={habit.score}>
									{habit.score}
								</Badge>
								<Badge ml="12" variant={habitStrengthToBadgeVariant[habit.strength]}>
									{habit.strength}
								</Badge>
								{!habit.is_trackable && (
									<Badge ml="6" variant="neutral">
										Untracked
									</Badge>
								)}
							</Row>
						))}
					</Column>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

function getHabitsAddedAtThisDay(habits: IHabit[], day: string | Date): IHabit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});
}
