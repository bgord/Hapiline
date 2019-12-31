import * as Async from "react-async";

import {IDayVote} from "../interfaces/IDayVote";
import {IDayVoteStatsFromAPI} from "../interfaces/IMonthDay";
import {_internal_api} from "./api";

export const getMonthRequest: Async.PromiseFn<IDayVoteStatsFromAPI[]> = ({monthOffset}) =>
	_internal_api
		.get<IDayVoteStatsFromAPI[]>(`/month?monthOffset=${monthOffset}`)
		.then(response => response.data);

export const getDayRequest: Async.PromiseFn<IDayVote[]> = ({day}) =>
	_internal_api.get<IDayVote[]>(`/day-votes?day=${day}`).then(response => response.data);
