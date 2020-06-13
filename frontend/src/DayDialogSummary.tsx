import {isSameDay} from "date-fns";
import {Tabs, TabList, Tab, TabPanels, TabPanel} from "@reach/tabs";
import * as UI from "./ui/";
import React from "react";
import {Link} from "react-router-dom";
import VisuallyHidden from "@reach/visually-hidden";

import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useHabits, useUntrackedHabits} from "./contexts/habits-context";
import {
	Habit,
	habitStrengthToBadgeVariant,
	voteToBgColor,
	DayCellWithFullStats,
} from "./interfaces/index";

import {UrlBuilder} from "./services/url-builder";

type DayDialogSummaryProps = Omit<
	DayCellWithFullStats,
	"styles" | "createdHabitsCount" | "nullVotesCountStats"
> & {
	maximumVotes: number;
};

export const DaySummaryChart: React.FC<DayDialogSummaryProps & JSX.IntrinsicElements["div"]> = ({
	maximumVotes,
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
		<UI.Row width="100%">
			<UI.Row
				mainAxis="center"
				crossAxis="center"
				title={noVotesCellTitle}
				py="0"
				px={stats.noVotesCountStats ? "3" : "0"}
				style={{
					flexBasis: `${noVotesPercentage}%`,
					backgroundColor: voteToBgColor.get(null),
					fontWeight: "bold",
					color: "var(--gray-3)",
					height: "18px",
					fontSize: "14px",
				}}
			>
				<VisuallyHidden>{stats.noVotesCountStats} habits with no votes</VisuallyHidden>
				{stats.noVotesCountStats > 0 && stats.noVotesCountStats}
			</UI.Row>
			<UI.Row
				mainAxis="center"
				crossAxis="center"
				title={regressVotesCellTitle}
				py="0"
				px="3"
				style={{
					fontWeight: "bold",
					flexBasis: `${regressVotesPercentage}%`,
					backgroundColor: voteToBgColor.get("regress"),
					color: "#720A13",
					height: "18px",
					fontSize: "14px",
				}}
			>
				<VisuallyHidden>
					{stats.regressVotesCountStats ?? 0} habits with regress votes
				</VisuallyHidden>
				{stats.regressVotesCountStats ?? 0}
			</UI.Row>

			<UI.Row
				mainAxis="center"
				crossAxis="center"
				title={plateauVotesCellTitle}
				py="0"
				px="3"
				style={{
					fontWeight: "bold",
					flexBasis: `${plateauVotesPercentage}%`,
					backgroundColor: voteToBgColor.get("plateau"),
					color: "var(--gray-9)",
					height: "18px",
					fontSize: "14px",
				}}
			>
				<VisuallyHidden>
					{stats.plateauVotesCountStats ?? 0} habits with plateau votes
				</VisuallyHidden>
				{stats.plateauVotesCountStats ?? 0}
			</UI.Row>

			<UI.Row
				mainAxis="center"
				crossAxis="center"
				title={progressVotesCellTitle}
				py="0"
				px="3"
				style={{
					fontWeight: "bold",
					flexBasis: `${progressVotesPercentage}%`,
					background: voteToBgColor.get("progress"),
					color: "#106015",
					height: "18px",
					fontSize: "14px",
				}}
			>
				<VisuallyHidden>
					{stats.progressVotesCountStats ?? 0} habits with progress votes
				</VisuallyHidden>
				{stats.progressVotesCountStats ?? 0}
			</UI.Row>
		</UI.Row>
	);
};

export const DayDialogSummaryTabs: React.FC<{day: string}> = ({day}) => {
	const habits = useHabits();
	const habitsAddedAtThisDay = getHabitsAddedAtThisDay(habits, day);

	const _untrackedHabits = useUntrackedHabits();
	const untrackedHabits = getHabitsAvailableAtThisDay(_untrackedHabits, day);

	return (
		// -1 means that no tab is selected by default
		<Tabs data-mt="48" defaultIndex={-1}>
			<TabList>
				<Tab as={UI.Button} variant="bare">
					Show new habits
				</Tab>
				<Tab as={UI.Button} variant="bare" ml="12">
					Show untracked habits
				</Tab>
			</TabList>
			<TabPanels data-mt="12">
				<TabPanel>
					{habitsAddedAtThisDay.length === 0 && <UI.Text>No habits added this day.</UI.Text>}

					{habitsAddedAtThisDay.length === 1 && (
						<UI.Text>
							<UI.Text variant="bold">One</UI.Text> habit added this day.
						</UI.Text>
					)}

					{habitsAddedAtThisDay.length > 1 && (
						<>
							<UI.Text variant="bold">{habitsAddedAtThisDay.length}</UI.Text>{" "}
							<UI.Text>habits added this day</UI.Text>.
						</>
					)}

					<UI.Column
						style={{
							borderTop: habitsAddedAtThisDay.length > 0 ? `1px solid var(--gray-1)` : undefined,
						}}
						mt="24"
					>
						{habitsAddedAtThisDay.map(habit => (
							<CompactHabitItem key={habit.id} {...habit} />
						))}
					</UI.Column>
				</TabPanel>

				<TabPanel>
					{untrackedHabits.length === 0 && (
						<UI.Text>No untracked habit available this day.</UI.Text>
					)}

					{untrackedHabits.length === 1 && (
						<UI.Text>
							<UI.Text variant="bold">One</UI.Text> untracked habit available this day.
						</UI.Text>
					)}

					{untrackedHabits.length > 1 && (
						<UI.Text>{useUntrackedHabits.length} untracked habit available this day.</UI.Text>
					)}

					<UI.Column
						style={{
							borderTop: untrackedHabits.length > 0 ? `1px solid var(--gray-1)` : undefined,
						}}
						mt="24"
					>
						{untrackedHabits.map(habit => (
							<CompactHabitItem key={habit.id} {...habit} />
						))}
					</UI.Column>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

function getHabitsAddedAtThisDay(habits: Habit[], day: string | Date): Habit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});
}

const CompactHabitItem: React.FC<Habit> = ({name, id, score, strength, is_trackable}) => (
	<UI.Row as="li" py="12" by="gray-1">
		<UI.Text as={Link} to={UrlBuilder.habits.preview(id)} variant="semi-bold">
			{name}
		</UI.Text>

		<UI.Badge ml="auto" variant={score}>
			{score}
		</UI.Badge>

		<UI.Badge ml="12" variant={habitStrengthToBadgeVariant[strength]}>
			{strength}
		</UI.Badge>

		{!is_trackable && (
			<UI.Badge ml="12" variant="neutral">
				Untracked
			</UI.Badge>
		)}
	</UI.Row>
);
