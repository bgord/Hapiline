import {eachDayOfInterval, endOfMonth, startOfMonth, subMonths} from "date-fns";
import React from "react";

import {IMonthDay} from "../interfaces/IMonthDay";
import {formatDay, formatMonth} from "../config/DATE_FORMATS";

type MonthsWidgetProps = [
	{
		givenMonthDays: IMonthDay[];
		setPreviousMonth: VoidFunction;
		setNextMonth: VoidFunction;
	},
	string,
	number,
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
		day: formatDay(day),
		styles: {gridColumnStart: index === 0 ? offset : undefined},
	}));

	return [
		{
			givenMonthDays,
			setPreviousMonth,
			setNextMonth,
		},
		formatMonth(date),
		monthOffset,
	];
};
