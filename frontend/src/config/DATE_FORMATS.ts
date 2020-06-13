import {format} from "date-fns";

const DATE_FORMATS = {
	day: "yyyy-MM-dd",
	time: "yyyy-MM-dd HH:mm",
	month: "MMMM yyyy",
	dayName: "iiii",
	shortDayName: "E",
};

export const formatDay = (value: number | Date | string): string =>
	format(new Date(value), DATE_FORMATS.day);

export const formatTime = (value: number | Date | string): string =>
	format(new Date(value), DATE_FORMATS.time);

export const formatMonth = (value: number | Date | string): string =>
	format(new Date(value), DATE_FORMATS.month);

export const formatDayName = (value: number | Date | string): string =>
	format(new Date(value), DATE_FORMATS.dayName);

export const formatShortDayName = (value: number | Date | string): string =>
	format(new Date(value), DATE_FORMATS.shortDayName);

export const formatToday = () => formatDay(new Date());
