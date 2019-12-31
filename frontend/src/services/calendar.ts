import * as Async from "react-async";

import {IDayVote} from "../interfaces/IDayVote";
import {_internal_api} from "./api";

interface MonthStats {
	day: string;
	createdHabitsCount: number;
	progressVotesCountStats: number;
	plateauVotesCountStats: number;
	regressVotesCountStats: number;
	nullVotesCountStats: number;
}

export const getMonthRequest: Async.PromiseFn<MonthStats[]> = ({monthOffset}) =>
	_internal_api
		.get<MonthStats[]>(`/month?monthOffset=${monthOffset}`)
		.then(response => response.data);

export const getDayRequest: Async.PromiseFn<IDayVote[]> = ({day}) =>
	_internal_api.get<IDayVote[]>(`/day-votes?day=${day}`).then(response => response.data);
