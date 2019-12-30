import {isBefore, isFuture, isSameDay, isToday} from "date-fns";
import React from "react";
import useHover from "@react-hook/hover";

import {BareButton} from "./BareButton";
import {DayDialog} from "./DayDialog";
import {MonthDayProps} from "./hooks/useMonthsWidget";
import {Stat} from "./Stat";
import {useDialog} from "./hooks/useDialog";
import {useHabits} from "./contexts/habits-context";

export const Day: React.FC<MonthDayProps> = ({day, styles, ...stats}) => {
	const habits = useHabits();
	const [isHovering, ref] = useHover();
	const [showDialog, openDialog, closeDialog] = useDialog();

	const thisDay = new Date(day);
	const isThisDayToday = isToday(new Date(day));
	const isThisDayInTheFuture = isFuture(thisDay);

	const habitsAvailableAtThisDay = habits.filter(
		habit =>
			isBefore(new Date(habit.created_at), thisDay) ||
			isSameDay(new Date(habit.created_at), thisDay),
	).length;

	const noVotesCountStats: number =
		habitsAvailableAtThisDay -
		(stats.progressVotesCountStats ?? 0) -
		(stats.plateauVotesCountStats ?? 0) -
		(stats.regressVotesCountStats ?? 0);

	const isDayDialogBeAvailable = !isThisDayInTheFuture && habitsAvailableAtThisDay > 0;

	return (
		<>
			<li
				className="flex flex-col justify-between align-center bg-green-100 hover:bg-green-200"
				style={styles}
				ref={ref as React.Ref<HTMLLIElement>}
			>
				<span className={`text-center w-full pt-2 ${isThisDayToday && "font-bold"}`}>{day}</span>
				{isDayDialogBeAvailable && (
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
							<Stat count={noVotesCountStats} sign="?" hidden={false} />
						</div>
						{showDialog && (
							<DayDialog
								day={day}
								closeDialog={closeDialog}
								noVotesCountStats={noVotesCountStats}
								{...stats}
							/>
						)}
					</>
				)}
			</li>
		</>
	);
};