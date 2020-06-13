import {eachDayOfInterval, endOfMonth, startOfMonth, subMonths} from "date-fns";
import React from "react";

import {DayCell} from "../models";
import {formatDay, formatMonth} from "../config/DATE_FORMATS";

export type MonthOffset = number;

type MonthsWidgetProps = [
	{
		daysOfTheMonth: DayCell[];
		setPreviousMonth: VoidFunction;
		setNextMonth: VoidFunction;
	},
	string,
	MonthOffset,
];

export const useMonthsWidget = (): MonthsWidgetProps => {
	const [monthOffset, setMonthOffset] = React.useState<MonthOffset>(0);

	const setPreviousMonth = () => setMonthOffset(x => x + 1);
	const setNextMonth = () => setMonthOffset(x => (x <= 0 ? 0 : x - 1));

	const today = Date.now();

	const date = subMonths(today, monthOffset);

	const startOfGivenMonth = startOfMonth(date);
	const endOfGivenMonth = endOfMonth(date);

	// 0 - Sunday, 1 - Monday, ... , 6 - Saturday
	const startOfGivenMonthDay = startOfGivenMonth.getDay();

	const offset = startOfGivenMonthDay === 0 ? 7 : startOfGivenMonthDay;

	const daysOfTheMonth = eachDayOfInterval({
		start: startOfGivenMonth,
		end: endOfGivenMonth,
	}).map((day, index) => ({
		day: formatDay(day),
		styles: {gridColumnStart: index === 0 ? offset : undefined},
	}));

	return [
		{
			daysOfTheMonth,
			setPreviousMonth,
			setNextMonth,
		},
		formatMonth(date),
		monthOffset,
	];
};
