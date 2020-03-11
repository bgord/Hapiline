import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";

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

	const isNewTextVisible = stats && stats.createdHabitsCount && stats.createdHabitsCount > 0;

	return (
		<Column style={{background: "var(--gray-0)", border: "1px solid var(--gray-2)", ...styles}}>
			<Text mt="6" variant={isThisDayToday ? "bold" : "regular"} style={{textAlign: "center"}}>
				{day}
			</Text>
			{isDayDialogAvailable && (
				<>
					<Row mt="auto" mainAxis="end" p="6">
						{isNewTextVisible ? (
							<Text mr="auto" variant="dimmed">
								NEW: {stats.createdHabitsCount}
							</Text>
						) : null}
						<Button
							variant="bare"
							onClick={openDialog}
							style={{background: "var(--gray-1)"}}
							mb="6"
							ml="auto"
						>
							Show day
						</Button>
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
