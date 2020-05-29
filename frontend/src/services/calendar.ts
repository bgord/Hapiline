import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {HabitVote, DayStatsFromServer} from "../interfaces/index";
import {MonthOffset} from "../hooks/useMonthsWidget";
import {formatDay} from "../config/DATE_FORMATS";

export const getMonthRequest = (_key: "month", monthOffset: MonthOffset) =>
	_internal_api
		.get<DayStatsFromServer[]>(constructUrl("/month", {monthOffset: String(monthOffset)}))
		.then(response => response.data);

export const getDayRequest = (_key: "day", day: Date) =>
	_internal_api
		.get<HabitVote[]>(constructUrl("/day-votes", {day: formatDay(day)}))
		.then(response => response.data);
