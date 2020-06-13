import React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import {Link} from "react-router-dom";
import {QueryResult} from "react-query";

import {DashboardStreakStats} from "../../models";
import {useToggle} from "../../hooks/useToggle";
import {pluralize} from "../../services/pluralize";
import {UrlBuilder} from "../../services/url-builder";

import {ChevronUpIcon} from "../../ui/icons/ChevronUp";
import {ChevronDownIcon} from "../../ui/icons/ChevronDown";
import {ExpandContractList} from "../../ui/ExpandContractList";

import * as UI from "../../ui";

export const DashboardProgressStreakList: React.FC<{
	request: QueryResult<DashboardStreakStats>;
}> = ({request}) => {
	const {on: isProgressStreakListVisible, toggle: toggleProgressStreakList} = useToggle(true);

	const progressStreakStats = request.data?.progress_streaks ?? [];

	if (progressStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="48" mb="24" crossAxis="center">
				<UI.Header variant="extra-small">Progress streaks</UI.Header>
				<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
					{progressStreakStats.length}
				</UI.Badge>

				{isProgressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide progress streak list"
						onClick={toggleProgressStreakList}
					>
						<VisuallyHidden>Hide progress streak list</VisuallyHidden>
						<ChevronUpIcon />
					</UI.Button>
				)}

				{!isProgressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show progress streak list"
						onClick={toggleProgressStreakList}
					>
						<VisuallyHidden>Show progress streak list</VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isProgressStreakListVisible && (
				<UI.Column bt="gray-1">
					<ExpandContractList max={5}>
						{progressStreakStats.map(habit => (
							<UI.Row py="12" by="gray-1" key={habit.id} mainAxis="end">
								<UI.Text mr="auto" as={Link} to={UrlBuilder.dashboard.habit.preview(habit.id)}>
									{habit.name}
								</UI.Text>

								{!habit.has_vote_for_today && (
									<UI.Badge
										as={Link}
										to={UrlBuilder.dashboard.calendar.habitToday(habit.id)}
										variant="neutral"
										mx="12"
										title="Vote for this habit"
									>
										No vote yet
									</UI.Badge>
								)}

								<UI.Badge variant="positive">
									{habit.progress_streak} {pluralize("day", habit.progress_streak)} progress streak
								</UI.Badge>
							</UI.Row>
						))}
					</ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};
