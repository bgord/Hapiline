import * as Async from "react-async";

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
