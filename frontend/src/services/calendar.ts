import * as Async from "react-async";

import {IDayVote} from "../interfaces/IDayVote";
import {IDayVoteStatsFromAPI} from "../interfaces/IMonthDay";
import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";

export const getMonthRequest: Async.PromiseFn<IDayVoteStatsFromAPI[]> = ({monthOffset}) =>
	_internal_api
		.get<IDayVoteStatsFromAPI[]>(constructUrl("/month", {monthOffset}))
		.then(response => response.data);

export const getDayRequest: Async.PromiseFn<IDayVote[]> = ({day}) =>
	_internal_api.get<IDayVote[]>(constructUrl("/day-votes", {day})).then(response => response.data);
