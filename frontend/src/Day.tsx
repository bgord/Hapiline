import {isFuture, isSameDay, isToday} from "date-fns";
import React from "react";
import useHover from "@react-hook/hover";

import {BareButton} from "./BareButton";
import {DayDialog} from "./DayDialog";
import {FullDayWithVoteStats} from "./interfaces/IMonthDay";
import {Stat} from "./Stat";
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

	const previewDay = queryParams?.previewDay;

	const thisDay = new Date(day);
	const isThisDayToday = isToday(new Date(day));
	const isThisDayInTheFuture = isFuture(thisDay);

	const howManyHabitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, thisDay).length;

	const isDayDialogAvailable = !isThisDayInTheFuture && howManyHabitsAvailableAtThisDay > 0;
	const isDayDialogVisible = previewDay && isSameDay(new Date(previewDay), thisDay);

	function openDialog() {
		updateQueryParams("calendar", {
			previewDay: day,
			habit_vote_filter: isThisDayToday ? "unvoted" : "all",
		});
	}

	return (
		<li
			className="flex flex-col justify-between align-center bg-green-100 hover:bg-green-200"
			style={styles}
			ref={ref as React.Ref<HTMLLIElement>}
		>
			<span className={`text-center w-full pt-2 ${isThisDayToday && "font-bold"}`}>{day}</span>
			{isDayDialogAvailable && (
				<>
					<BareButton hidden={!isHovering} onClick={openDialog}>
						Show day
					</BareButton>
					<div className="flex justify-end p-2 text-sm">
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
