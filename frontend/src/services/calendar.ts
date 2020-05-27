import * as Async from "react-async";

import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {HabitVote, DayStatsFromServer} from "../interfaces/index";
import {MonthOffset} from "../hooks/useMonthsWidget";

export const getMonthRequest = (_key: "month", monthOffset: MonthOffset) =>
	_internal_api
		.get<DayStatsFromServer[]>(constructUrl("/month", {monthOffset: String(monthOffset)}))
		.then(response => response.data);

export const getDayRequest: Async.PromiseFn<HabitVote[]> = ({day}) =>
	_internal_api.get<HabitVote[]>(constructUrl("/day-votes", {day})).then(response => response.data);
