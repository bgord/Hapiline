import {Dialog} from "@reach/dialog";
import {isBefore, isSameDay, isToday} from "date-fns";
import * as Async from "react-async";
import React from "react";
import useHover from "@react-hook/hover";

import {CloseButton} from "./CloseButton";
import {MonthDayProps, useMonthsWidget} from "./hooks/useMonthsWidget";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useDialog} from "./hooks/useDialog";
import {useHabits} from "./contexts/habits-context";
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
		createdHabitsCount: getMonthRequestState.data?.find(item => item.day === entry.day)
			?.createdHabitsCount,
		progressVotesCountStats: getMonthRequestState.data?.find(item => item.day === entry.day)
			?.progressVotesCountStats,
		plateauVotesCountStats: getMonthRequestState.data?.find(item => item.day === entry.day)
			?.plateauVotesCountStats,
		regressVotesCountStats: getMonthRequestState.data?.find(item => item.day === entry.day)
			?.regressVotesCountStats,
		nullVotesCountStats: getMonthRequestState.data?.find(item => item.day === entry.day)
			?.nullVotesCountStats,
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

const Day: React.FC<MonthDayProps> = ({
	day,
	styles,
	createdHabitsCount,
	progressVotesCountStats,
	plateauVotesCountStats,
	regressVotesCountStats,
	nullVotesCountStats,
}) => {
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
					{createdHabitsCount && <span>NEW: {createdHabitsCount} |</span>}
					{progressVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">+ {progressVotesCountStats}</span>
					)}
					{plateauVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">= {plateauVotesCountStats}</span>
					)}
					{regressVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">- {regressVotesCountStats}</span>
					)}
					{nullVotesCountStats !== undefined && (
						<span className="ml-2 bg-green-200">? {nullVotesCountStats}</span>
					)}
				</div>
			</li>
			{showDialog && (
				<DayDialog day={day} createdHabitsCount={createdHabitsCount} closeDialog={closeDialog} />
			)}
		</>
	);
};

type DayDialogProps = Omit<MonthDayProps, "styles"> & {closeDialog: VoidFunction};

const DayDialog: React.FC<DayDialogProps> = ({day, createdHabitsCount, closeDialog}) => {
	const getHabitsRequestState = useHabits();
	const habits = getHabitsRequestState?.data ?? [];

	const habitsAvailableAtGivenDay = habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});

	const habitsAddedAtGivenDay = habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate);
	});

	const areAnyHabitsAvailable = habitsAvailableAtGivenDay.length === 0;

	return (
		<Dialog aria-label="Show day preview">
			<div className="flex justify-between items-baseline">
				<strong>{day}</strong>
				<CloseButton onClick={closeDialog} />
			</div>
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul>
				{habitsAvailableAtGivenDay.map(habit => (
					<li
						key={habit.id}
						className="flex items-baseline justify-between bg-blue-100 my-2 p-2 mt-4"
					>
						<div>{habit.name}</div>
						<div>
							<button className="py-2 px-4 bg-white" type="button">
								+
							</button>
							<button className="py-2 px-4 ml-2 bg-white" type="button">
								=
							</button>
							<button className="py-2 px-4 ml-2 bg-white" type="button">
								-
							</button>
						</div>
					</li>
				))}
			</ul>
			<div className="flex p-2 pl-0 text-sm">
				{createdHabitsCount && (
					<details className="mt-8">
						<summary title={`${createdHabitsCount} habit(s) added this day`}>
							NEW: {createdHabitsCount}
						</summary>
						<p>Habit(s) added this day:</p>
						<ul className="mt-2">
							{habitsAddedAtGivenDay.map(habit => (
								<li key={habit.id}>{habit.name}</li>
							))}
						</ul>
					</details>
				)}
			</div>
		</Dialog>
	);
};
