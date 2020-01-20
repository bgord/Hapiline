import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";
import useHover from "@react-hook/hover";

import {BareButton} from "./BareButton";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {FullDayWithVoteStats} from "./interfaces/IMonthDay";
import {Stat} from "./Stat";
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
				<DaySummaryChart className="h-2" day={formatDay(thisDay)} {...stats} />
			)}
			<span className={`text-center w-full pt-2 ${isThisDayToday && "font-bold"}`}>{day}</span>
			{isDayDialogAvailable && (
				<>
					<BareButton hidden={!isHovering} onClick={openDialog}>
						Show day
					</BareButton>
					<div className="flex justify-end p-2 text-sm mt-auto">
						<span hidden={!stats.createdHabitsCount} className="mr-auto">
							NEW: {stats.createdHabitsCount}
						</span>
						<Stat count={stats.progressVotesCountStats} sign="+" />
						<Stat count={stats.plateauVotesCountStats} sign="=" />
						<Stat count={stats.regressVotesCountStats} sign="-" />
						<Stat count={stats.noVotesCountStats} sign="?" />
					</div>
					{isDayDialogVisible && (
						<DayDialog day={day} refreshCalendar={refreshCalendar} {...stats} />
					)}
				</>
			)}
		</li>
	);
};
