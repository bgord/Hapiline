import {differenceInMonths, eachDayOfInterval, endOfMonth, startOfMonth, subMonths} from "date-fns";

import {DayCell} from "../models";
import {formatDay, formatMonth} from "../services/date-formatter";
import {useQueryParam} from "./useQueryParam";

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
	const [monthOffsetInUrl, setMonthOffsetInUrl] = useQueryParam("month_offset");

	const monthOffset = isNumber(monthOffsetInUrl) ? Number(monthOffsetInUrl) : 0;

	const setPreviousMonth = () => setMonthOffsetInUrl((monthOffset + 1).toString());
	const setNextMonth = () =>
		setMonthOffsetInUrl((monthOffset <= 0 ? 0 : monthOffset - 1).toString());

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

export function getMonthOffsetFromDate(date: Date) {
	return Math.abs(differenceInMonths(new Date(date), endOfMonth(new Date())));
}

function isNumber(value: unknown) {
	return !Number.isNaN(Number(value));
}
