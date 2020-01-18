import {format} from "date-fns";

const DATE_FORMATS = {
	day: "yyyy-MM-dd",
	time: "yyyy-MM-dd HH:mm",
	month: "MMMM yyyy",
};

export const formatDay = (value: number | Date): string => format(value, DATE_FORMATS.day);
export const formatTime = (value: number | Date): string => format(value, DATE_FORMATS.time);
export const formatMonth = (value: number | Date): string => format(value, DATE_FORMATS.month);

export const formatToday = () => formatDay(new Date());
