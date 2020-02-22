import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";
import useHover from "@react-hook/hover";

import {Button} from "./ui/button/Button";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {FullDayWithVoteStats} from "./interfaces/IMonthDay";
import {Row} from "./ui/row/Row";
import {Stat} from "./Stat";
import {Text} from "./ui/text/Text";
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
		<li
			className="flex flex-col bg-green-100 hover:bg-green-200"
			style={styles}
			ref={ref as React.Ref<HTMLLIElement>}
		>
			{isDayDialogAvailable && (
				<DaySummaryChart
					maximumVotes={howManyHabitsAvailableAtThisDay}
					className="h-2"
					day={formatDay(thisDay)}
					{...stats}
				/>
			)}
			<Text
				variant={isThisDayToday ? "bold" : "regular"}
				style={{textAlign: "center", marginTop: "4px"}}
			>
				{day}
			</Text>
			{isDayDialogAvailable && (
				<>
					<Button
						ml="auto"
						mr="auto"
						mt="6"
						mb="6"
						variant="outlined"
						hidden={!isHovering}
						onClick={openDialog}
					>
						Show day
					</Button>
					<Row mainAxis="end" style={{marginTop: "auto", padding: "4px"}}>
						<Text variant="dimmed" hidden={!stats.createdHabitsCount} style={{marginRight: "auto"}}>
							NEW: {stats.createdHabitsCount}
						</Text>
						<Stat count={stats.progressVotesCountStats} sign="+" />
						<Stat count={stats.plateauVotesCountStats} sign="=" />
						<Stat count={stats.regressVotesCountStats} sign="-" />
						<Stat count={stats.noVotesCountStats} sign="?" />
					</Row>
					{isDayDialogVisible && <DayDialog day={day} onResolve={refreshCalendar} {...stats} />}
				</>
			)}
		</li>
	);
};
