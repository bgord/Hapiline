import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";

import * as UI from "./ui";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {DayCellWithFullStats} from "./models";
import {formatDay, formatShortDayName} from "./services/date-formatter";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useHabits} from "./contexts/habits-context";
import {useQueryParams} from "./hooks/useQueryParam";
import {pluralize} from "./services/pluralize";

export const Day: React.FC<DayCellWithFullStats & {refreshCalendar: VoidFunction}> = props => {
	const {day, styles, refreshCalendar, ...stats} = props;

	const habits = useHabits();
	const [queryParams, updateQueryParams] = useQueryParams();

	const previewDay = queryParams?.preview_day;

	const thisDay = new Date(day);
	const isThisDayToday = isToday(new Date(day));
	const isThisDayInTheFuture = isFuture(thisDay);

	const numberOfHabitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, thisDay).length;

	const isDayDialogAvailable = !isThisDayInTheFuture && numberOfHabitsAvailableAtThisDay > 0;
	const isDayDialogVisible = previewDay && isSameDay(new Date(previewDay), thisDay);

	function openDialog() {
		updateQueryParams("calendar", {
			preview_day: day,
			habit_vote_filter: isThisDayToday && stats.numberOfMissingVotes > 0 ? "unvoted" : "all",
		});
	}

	const isNewHabitsTextVisible = stats && stats.numberOfCreatedHabits > 0;

	const newHabitsText = `${stats.numberOfCreatedHabits} new ${pluralize(
		"habit",
		stats.numberOfCreatedHabits ?? 0,
	)}`;

	return (
		<UI.Column mt={[, "6"]} data-testid="day" bg="gray-0" bw="2" b="gray-1" style={styles}>
			<UI.Row mainAxis="between" px="6">
				<UI.Text variant={isThisDayToday ? "bold" : "regular"} style={{textAlign: "center"}}>
					{day}
				</UI.Text>

				<UI.Text variant={isThisDayToday ? "bold" : "regular"} ml={[, "12"]} mr={[, "auto"]}>
					{formatShortDayName(day)}
				</UI.Text>
			</UI.Row>
			{isDayDialogAvailable && (
				<>
					<UI.Row crossAxis="end" mainAxis="end" p="6" my="auto">
						{isNewHabitsTextVisible && (
							<UI.Text mr="auto" variant="dimmed">
								{newHabitsText}
							</UI.Text>
						)}
						<UI.Button variant="bare" bg="gray-1" ml="auto" onClick={openDialog}>
							Show
						</UI.Button>
					</UI.Row>
					{isDayDialogVisible && <DayDialog day={day} onResolve={refreshCalendar} {...stats} />}
				</>
			)}
			{isDayDialogAvailable && (
				<DaySummaryChart
					numberOfPossibleVotes={numberOfHabitsAvailableAtThisDay}
					day={formatDay(thisDay)}
					{...stats}
				/>
			)}
		</UI.Column>
	);
};
