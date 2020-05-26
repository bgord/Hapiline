import * as Async from "react-async";

import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {HabitVote, DayStats} from "../interfaces/index";

export const getMonthRequest: Async.PromiseFn<DayStats[]> = ({monthOffset}) =>
	_internal_api
		.get<DayStats[]>(constructUrl("/month", {monthOffset}))
		.then(response => response.data);

export const getDayRequest: Async.PromiseFn<HabitVote[]> = ({day}) =>
	_internal_api.get<HabitVote[]>(constructUrl("/day-votes", {day})).then(response => response.data);
