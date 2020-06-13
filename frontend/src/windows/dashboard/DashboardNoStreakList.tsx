import React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import {Link} from "react-router-dom";

import {DashboardStreakStats} from "../../models";
import {useToggle} from "../../hooks/useToggle";
import {UrlBuilder} from "../../services/url-builder";

import {ChevronUpIcon} from "../../ui/icons/ChevronUp";
import {ChevronDownIcon} from "../../ui/icons/ChevronDown";
import {ExpandContractList} from "../../ui/ExpandContractList";

import * as UI from "../../ui";

export const DashboardNoStreakList: React.FC<{
	noStreakStats: DashboardStreakStats["no_streak"];
}> = ({noStreakStats}) => {
	const {on: isNoStreakListVisible, toggle: toggleNoStreakList} = useToggle(true);

	if (noStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="24" crossAxis="center">
				<UI.Header variant="extra-small">No streak</UI.Header>
				<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
					{noStreakStats.length}
				</UI.Badge>

				{isNoStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide no streak list"
						onClick={toggleNoStreakList}
					>
						<VisuallyHidden>Hide no streak list</VisuallyHidden>
						<ChevronUpIcon />
					</UI.Button>
				)}

				{!isNoStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show no streak list"
						onClick={toggleNoStreakList}
					>
						<VisuallyHidden>Show no streak list</VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isNoStreakListVisible && (
				<UI.Column by="gray-1" mt="24">
					<ExpandContractList max={5}>
						{noStreakStats.map(habit => (
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
							</UI.Row>
						))}
					</ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};
