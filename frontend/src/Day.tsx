import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";
import useHover from "@react-hook/hover";

import {Button, Row, Text, Column} from "./ui";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {FullDayWithVoteStats} from "./interfaces/IMonthDay";
import {formatDay} from "./config/DATE_FORMATS";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useHabits} from "./contexts/habits-context";
import {useQueryParams} from "./hooks/useQueryParam";

export const Day: React.FC<FullDayWithVoteStats & {refreshCalendar: VoidFunction}> = ({
	day,
	styles,
	refreshCalendar,
	...stats
}) => {
	const habits = useHabits();
	const [isHovering, ref] = useHover();
	const [queryParams, updateQueryParams] = useQueryParams();

	const previewDay = queryParams?.preview_day;

	const thisDay = new Date(day);
	const isThisDayToday = isToday(new Date(day));
	const isThisDayInTheFuture = isFuture(thisDay);

	const howManyHabitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, thisDay).length;

	const isDayDialogAvailable = !isThisDayInTheFuture && howManyHabitsAvailableAtThisDay > 0;
	const isDayDialogVisible = previewDay && isSameDay(new Date(previewDay), thisDay);

	function openDialog() {
		updateQueryParams("calendar", {
			preview_day: day,
			habit_vote_filter: isThisDayToday && stats.noVotesCountStats > 0 ? "unvoted" : "all",
		});
	}

	return (
		<Column style={{background: "var(--gray-0)", ...styles}} ref={ref as React.Ref<HTMLDivElement>}>
			<Text mt="6" variant={isThisDayToday ? "bold" : "regular"} style={{textAlign: "center"}}>
				{day}
			</Text>
			{isDayDialogAvailable && (
				<>
					<Button mx="auto" my="6" variant="outlined" hidden={!isHovering} onClick={openDialog}>
						Show day
					</Button>
					<Row mt="auto" mainAxis="end" style={{padding: "4px"}}>
						{stats && stats.createdHabitsCount && stats.createdHabitsCount > 0 ? (
							<Text mr="auto" variant="dimmed">
								NEW: {stats.createdHabitsCount}
							</Text>
						) : null}
					</Row>
					{isDayDialogVisible && <DayDialog day={day} onResolve={refreshCalendar} {...stats} />}
				</>
			)}
			{isDayDialogAvailable && (
				<DaySummaryChart
					maximumVotes={howManyHabitsAvailableAtThisDay}
					className="h-2"
					day={formatDay(thisDay)}
					{...stats}
				/>
			)}
		</Column>
	);
};
