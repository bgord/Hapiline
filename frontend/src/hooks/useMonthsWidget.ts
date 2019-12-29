import {
	eachDayOfInterval,
	endOfMonth,
	format,
	startOfMonth,
	subMonths,
} from "date-fns";
import React from "react";

export type MonthDayProps = {
	day: string;
	styles: {gridColumnStart: number | undefined};
};

export type MonthsWidgetProps = [
	{
		givenMonthDays: MonthDayProps[];
		setPreviousMonth: VoidFunction;
		setNextMonth: VoidFunction;
	},
	string,
	Date,
];

export const useMonthsWidget = (): MonthsWidgetProps => {
	const [monthOffset, setMonthOffset] = React.useState(0);

	const setPreviousMonth = () => setMonthOffset(x => x + 1);
	const setNextMonth = () => setMonthOffset(x => (x <= 0 ? 0 : x - 1));

	const today = Date.now();

	const date = subMonths(today, monthOffset);

	const startOfGivenMonth = startOfMonth(date);
	const endOfGivenMonth = endOfMonth(date);

	// 0 - Sunday, 1 - Monday, ... , 6 - Saturday
	const startOfGivenMonthDay = startOfGivenMonth.getDay();

	const offset = startOfGivenMonthDay === 0 ? 7 : startOfGivenMonthDay;

	const givenMonthDays = eachDayOfInterval({
		start: startOfGivenMonth,
		end: endOfGivenMonth,
	}).map((day, index) => ({
		day: format(day, "yyyy-MM-dd"),
		styles: {gridColumnStart: index === 0 ? offset : undefined},
	}));

	return [
		{
			givenMonthDays,
			setPreviousMonth,
			setNextMonth,
		},
		format(date, "MMMM yyyy"),
		date,
	];
};
