import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";

import {Button, Row, Text, Column} from "./ui";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {FullDayWithVoteStats} from "./interfaces/IMonthDay";
import {formatDay, formatShortDayName} from "./config/DATE_FORMATS";
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

	const isNewHabitsTextVisible = stats && stats.createdHabitsCount && stats.createdHabitsCount > 0;

	const newHabitsText = `${stats.createdHabitsCount} new habit${
		(stats.createdHabitsCount ?? 0) > 1 ? "s" : ""
	}`;

	return (
		<Column
			data-testid="day"
			style={{background: "var(--gray-0)", border: "2px solid var(--gray-1)", ...styles}}
		>
			<Row mainAxis="between" px="6">
				<Text variant={isThisDayToday ? "bold" : "regular"} style={{textAlign: "center"}}>
					{day}
				</Text>
				<Text>{formatShortDayName(day)}</Text>
			</Row>
			{isDayDialogAvailable && (
				<>
					<Row mainAxis="end" p="6" my="auto">
						{isNewHabitsTextVisible ? (
							<Text mr="auto" variant="dimmed">
								{newHabitsText}
							</Text>
						) : null}
						<Button
							variant="bare"
							onClick={openDialog}
							style={{background: "var(--gray-1)"}}
							ml="auto"
						>
							Show
						</Button>
					</Row>
					{isDayDialogVisible && <DayDialog day={day} onResolve={refreshCalendar} {...stats} />}
				</>
			)}
			{isDayDialogAvailable && (
				<DaySummaryChart
					maximumVotes={howManyHabitsAvailableAtThisDay}
					day={formatDay(thisDay)}
					{...stats}
				/>
			)}
		</Column>
	);
};
