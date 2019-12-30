import {isToday} from "date-fns";
import * as Async from "react-async";
import React from "react";
import useHover from "@react-hook/hover";

import {DayDialog} from "./DayDialog";
import {MonthDayProps, useMonthsWidget} from "./hooks/useMonthsWidget";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useDialog} from "./hooks/useDialog";
import {useRequestErrors} from "./hooks/useRequestErrors";

export const Calendar: React.FC = () => {
	const [widget, date, monthOffset] = useMonthsWidget();

	const getMonthRequestState = Async.useAsync({
		promiseFn: api.calendar.getMonth,
		monthOffset,
		watch: monthOffset,
	});

	const {errorMessage} = useRequestErrors(getMonthRequestState);

	const days = widget.givenMonthDays.map(entry => ({
		...entry,
		...getMonthRequestState.data?.find(item => item.day === entry.day),
	}));

	const habitDialogGrid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: "repeat(7, 200px)",
		gridTemplateRows: "repeat(6, 120px)",
		gridGap: "3px",
	};

	return (
		<section className="flex flex-col items-center p-8 mx-auto">
			<div className="flex mb-16">
				<button
					className="px-2"
					type="button"
					onClick={widget.setPreviousMonth}
					disabled={getMonthRequestState.isPending}
				>
					Previous
				</button>
				<div className="mx-8 w-32">{date}</div>
				<button
					className="px-2"
					type="button"
					onClick={widget.setNextMonth}
					disabled={getMonthRequestState.isPending}
				>
					Next
				</button>
			</div>
			<Async.IfRejected state={getMonthRequestState}>
				<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
			</Async.IfRejected>
			<ul style={habitDialogGrid}>
				{days.map(props => (
					<Day key={props.day.toString()} {...props} />
				))}
			</ul>
		</section>
	);
};

const Day: React.FC<MonthDayProps> = ({day, styles, ...stats}) => {
	const [isHovering, ref] = useHover();
	const [showDialog, openDialog, closeDialog] = useDialog();

	const isGivenDayToday = isToday(new Date(day));

	return (
		<>
			<li
				className="flex flex-col justify-between align-center bg-green-100 hover:bg-green-200"
				style={styles}
				ref={ref as React.Ref<HTMLLIElement>}
			>
				<span className={`text-center w-full pt-2 ${isGivenDayToday && "font-bold"}`}>{day}</span>
				<button hidden={!isHovering} type="button" className="py-1 uppercase" onClick={openDialog}>
					show day
				</button>
				<div className="flex p-2 text-sm">
					{stats.createdHabitsCount && <span>NEW: {stats.createdHabitsCount} |</span>}
					{stats.progressVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">{`+${stats.progressVotesCountStats}`}</span>
					)}
					{stats.plateauVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">{`=${stats.plateauVotesCountStats}`}</span>
					)}
					{stats.regressVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">{`-${stats.regressVotesCountStats}`}</span>
					)}
				</div>
			</li>
			{showDialog && <DayDialog day={day} closeDialog={closeDialog} {...stats} />}
		</>
	);
};
