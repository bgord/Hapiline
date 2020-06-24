import React from "react";
import {Link} from "react-router-dom";
import {QueryResult} from "react-query";

import {DashboardHabitVoteStatsForDateRanges} from "../../models";
import * as UI from "../../ui";
import {useUntrackedHabits} from "../../contexts/habits-context";

export const DashboardMotivationalText: React.FC<{
	request: QueryResult<DashboardHabitVoteStatsForDateRanges>;
}> = ({request}) => {
	const {numberOfTrackedHabits, numberOfNonEmptyVotes} = extractFromRequest(request);

	const untrackedHabits = useUntrackedHabits();
	const numberOfUntrackedHabits = untrackedHabits.length;

	function selectStrategy() {
		if (numberOfTrackedHabits === 0) return "no_habits";
		if (numberOfNonEmptyVotes === 0) return "no_votes_today";
		if (numberOfNonEmptyVotes > 0 && numberOfNonEmptyVotes < numberOfTrackedHabits)
			return "not_all_voted";
		if (numberOfNonEmptyVotes === numberOfTrackedHabits) return "all_voted";
		return null;
	}

	const strategyToText = {
		no_habits: (
			// TODO: Improve it display a text and a button separately
			<UI.Text as={Link} variant="link" to="habits">
				Add your first tracked habit to start voting!
			</UI.Text>
		),
		no_votes_today: (
			<UI.Text>
				Start your day well! You have <UI.Text variant="bold">{numberOfTrackedHabits}</UI.Text>{" "}
				tracked habits to vote for. And {numberOfUntrackedHabits} untracked habits.
			</UI.Text>
		),
		not_all_voted: (
			<UI.Column>
				<UI.Text>You're on a good track!</UI.Text>
				<UI.Text>
					You have <UI.Text variant="bold">{numberOfTrackedHabits - numberOfNonEmptyVotes}</UI.Text>{" "}
					tracked habits to vote for left out of{" "}
					<UI.Text variant="bold">{numberOfTrackedHabits}</UI.Text> (and {numberOfUntrackedHabits}{" "}
					untracked habits).
				</UI.Text>
			</UI.Column>
		),
		all_voted: (
			<UI.Column>
				<UI.Row>
					<UI.Text variant="bold">Congratulations!</UI.Text>{" "}
					<UI.Text ml="6">
						You voted for every one of <UI.Text variant="bold">{numberOfTrackedHabits}</UI.Text>{" "}
						tracked habits today!
					</UI.Text>
				</UI.Row>{" "}
				<UI.Text>You also have {numberOfUntrackedHabits} untracked habits.</UI.Text>
			</UI.Column>
		),
	};

	const strategy = selectStrategy();

	if (!strategy) return null;

	return (
		<UI.Row mt="24" mb="48">
			{strategyToText[strategy]}
		</UI.Row>
	);
};

type ExtractedType = {
	numberOfTrackedHabits: number;
	numberOfNonEmptyVotes: number;
};

function extractFromRequest(
	request: QueryResult<DashboardHabitVoteStatsForDateRanges>,
): ExtractedType {
	return {
		numberOfTrackedHabits: request?.data?.today?.numberOfPossibleVotes ?? 0,
		numberOfNonEmptyVotes: request?.data?.today?.numberOfNonEmptyVotes ?? 0,
	};
}
