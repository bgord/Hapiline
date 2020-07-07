import React from "react";
import {Link} from "react-router-dom";
import {QueryResult} from "react-query";

import {DashboardStreakStats} from "../../models";
import {usePersistentToggle} from "../../hooks/useToggle";
import {pluralize} from "../../services/pluralize";
import {UrlBuilder} from "../../services/url-builder";

import {ChevronUpIcon} from "../../ui/icons/ChevronUp";
import {ChevronDownIcon} from "../../ui/icons/ChevronDown";

import * as UI from "../../ui";

export const DashboardProgressStreakList: React.FC<{
	request: QueryResult<DashboardStreakStats>;
}> = ({request}) => {
	const {on: isProgressStreakListVisible, toggle: toggleProgressStreakList} = usePersistentToggle(
		true,
		"show_progress_streak_list",
	);

	const progressStreakStats = request.data?.progress_streaks ?? [];

	if (progressStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="24" crossAxis="center">
				<UI.Header variant="extra-small" onClick={toggleProgressStreakList}>
					Progress streaks
				</UI.Header>
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
						<UI.VisuallyHidden>Hide progress streak list</UI.VisuallyHidden>
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
						<UI.VisuallyHidden>Show progress streak list</UI.VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isProgressStreakListVisible && (
				<UI.Column by="gray-1" mt="6">
					<UI.ExpandContractList max={5}>
						{progressStreakStats.map(habit => (
							<UI.Row
								mainAxis="between"
								crossAxis="end"
								pb="12"
								by="gray-1"
								key={habit.id}
								wrap="wrap"
								width="100%"
							>
								<UI.Text
									mr="12"
									mt="12"
									as={Link}
									to={UrlBuilder.dashboard.habit.preview(habit.id)}
								>
									{habit.name}
								</UI.Text>

								<UI.Row ml="auto" width="auto" wrap={[, "wrap-reverse"]} mainAxis="end" mt="6">
									{!habit.has_vote_for_today && (
										<UI.Badge
											mt={["12", "6"]}
											as={Link}
											to={UrlBuilder.dashboard.calendar.habitToday(habit.id)}
											variant="neutral"
											mr="12"
											title="Vote for this habit"
										>
											No vote yet
										</UI.Badge>
									)}

									<UI.Badge variant="positive" mt={["12", "6"]}>
										{habit.progress_streak} {pluralize("day", habit.progress_streak)} progress
										streak
									</UI.Badge>
								</UI.Row>
							</UI.Row>
						))}
					</UI.ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};
