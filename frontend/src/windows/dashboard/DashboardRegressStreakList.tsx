import React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import {Link} from "react-router-dom";

import {DashboardStreakStats} from "../../models";
import {useToggle} from "../../hooks/useToggle";
import {pluralize} from "../../services/pluralize";
import {UrlBuilder} from "../../services/url-builder";

import {ChevronUpIcon} from "../../ui/icons/ChevronUp";
import {ChevronDownIcon} from "../../ui/icons/ChevronDown";
import {ExpandContractList} from "../../ui/ExpandContractList";

import * as UI from "../../ui";

export const DashboardRegressStreakList: React.FC<{
	regressStreakStats: DashboardStreakStats["regress_streaks"];
}> = ({regressStreakStats}) => {
	const {on: isRegressStreakListVisible, toggle: toggleRegressStreakList} = useToggle(true);

	if (regressStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="24" crossAxis="center">
				<UI.Header variant="extra-small">Regress streaks</UI.Header>
				<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
					{regressStreakStats.length}
				</UI.Badge>

				{isRegressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide regress streak list"
						onClick={toggleRegressStreakList}
					>
						<VisuallyHidden>Hide regress streak list</VisuallyHidden>
						<ChevronUpIcon />
					</UI.Button>
				)}

				{!isRegressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show regress streak list"
						onClick={toggleRegressStreakList}
					>
						<VisuallyHidden>Show regress streak list</VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isRegressStreakListVisible && (
				<UI.Column by="gray-1" mt="24">
					<ExpandContractList max={5}>
						{regressStreakStats.map(habit => (
							<UI.Row py="12" by="gray-1" key={habit.id}>
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

								<UI.Badge variant="negative">
									{habit.regress_streak}
									{pluralize("day", habit.regress_streak)} regress streak
								</UI.Badge>
							</UI.Row>
						))}
					</ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};
