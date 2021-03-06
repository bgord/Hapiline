import React from "react";
import {Link} from "react-router-dom";
import {QueryResult} from "react-query";

import {DashboardStreakStats} from "../../models";
import {usePersistentToggle} from "../../hooks/useToggle";
import {UrlBuilder} from "../../services/url-builder";

import * as UI from "../../ui";

export function DashboardNoStreakList({request}: {request: QueryResult<DashboardStreakStats>}) {
	const {on: isNoStreakListVisible, toggle: toggleNoStreakList} = usePersistentToggle(
		true,
		"show_no_streak_list",
	);

	const noStreakStats = request.data?.no_streak ?? [];

	if (noStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="24" crossAxis="center">
				<UI.Header as="h2" variant="extra-small" onClick={toggleNoStreakList}>
					No streak
				</UI.Header>
				<UI.Badge ml="6" variant="neutral" size="slim">
					{noStreakStats.length}
				</UI.Badge>

				{isNoStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide no streak list"
						onClick={toggleNoStreakList}
					>
						<UI.VisuallyHidden>Hide no streak list</UI.VisuallyHidden>
						<UI.ChevronUpIcon />
					</UI.Button>
				)}

				{!isNoStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show no streak list"
						onClick={toggleNoStreakList}
					>
						<UI.VisuallyHidden>Show no streak list</UI.VisuallyHidden>
						<UI.ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isNoStreakListVisible && (
				<UI.Column by="gray-1" mt="6">
					<UI.ExpandContractList max={5}>
						{noStreakStats.map(habit => (
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
											as={Link}
											to={UrlBuilder.dashboard.calendar.habitToday(habit.id)}
											variant="neutral"
											mr="12"
											title="Vote for this habit"
										>
											No vote yet
										</UI.Badge>
									)}
								</UI.Row>
							</UI.Row>
						))}
					</UI.ExpandContractList>
				</UI.Column>
			)}
		</>
	);
}
