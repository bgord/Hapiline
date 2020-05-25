import * as Async from "react-async";

import {IDayVoteStatsFromAPI} from "../interfaces/IMonthDay";
import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {HabitVote} from "../interfaces/index";

export const getMonthRequest: Async.PromiseFn<IDayVoteStatsFromAPI[]> = ({monthOffset}) =>
	_internal_api
		.get<IDayVoteStatsFromAPI[]>(constructUrl("/month", {monthOffset}))
		.then(response => response.data);

export const getDayRequest: Async.PromiseFn<HabitVote[]> = ({day}) =>
	_internal_api.get<HabitVote[]>(constructUrl("/day-votes", {day})).then(response => response.data);
