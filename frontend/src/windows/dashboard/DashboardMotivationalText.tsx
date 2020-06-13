import React from "react";
import {Link} from "react-router-dom";
import {QueryResult} from "react-query";

import {DashboardHabitVoteStatsForDateRanges} from "../../models";
import * as UI from "../../ui";

export const DashboardMotivationalText: React.FC<{
	request: QueryResult<DashboardHabitVoteStatsForDateRanges>;
}> = ({request}) => {
	const {total, votedFor, untracked} = extractFromRequest(request);

	function selectStrategy() {
		if (total === 0) return "no_habits";
		if (votedFor === 0) return "no_votes_today";
		if (votedFor > 0 && votedFor < total) return "not_all_voted";
		if (votedFor === total) return "all_voted";
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
				Start your day well! You have <UI.Text variant="bold">{total}</UI.Text> tracked habits to
				vote for. And {untracked} untracked habits.
			</UI.Text>
		),
		not_all_voted: (
			<UI.Column>
				<UI.Text>You're on a good track!</UI.Text>
				<UI.Text>
					You have <UI.Text variant="bold">{total - votedFor}</UI.Text> tracked habits to vote for
					left out of <UI.Text variant="bold">{total}</UI.Text> (and {untracked} untracked habits).
				</UI.Text>
			</UI.Column>
		),
		all_voted: (
			<UI.Column>
				<UI.Row>
					<UI.Text variant="bold">Congratulations!</UI.Text>
					<UI.Text ml="6">
						You voted for every one of <UI.Text variant="bold">{total}</UI.Text>
						tracked habits today!
					</UI.Text>
				</UI.Row>
				<UI.Text>You also have {untracked} untracked habits.</UI.Text>
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
	total: number;
	untracked: number;
	votedFor: number;
};

function extractFromRequest(
	request: QueryResult<DashboardHabitVoteStatsForDateRanges>,
): ExtractedType {
	return {
		total: request?.data?.today?.maximumVotes ?? 0,
		untracked: request?.data?.today?.numberOfUntrackedHabits ?? 0,
		votedFor: request?.data?.today?.allVotes ?? 0,
	};
}
