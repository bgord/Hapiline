import * as Async from "react-async";

import {_internal_api} from "./api";

interface IDateRangeStats {
	progressVotes: number;
	plateauVotes: number;
	regressVotes: number;
	noVotes: number;
	allVotes: number;
	maximumVotes: number;
}

interface IDashboardStats {
	today: IDateRangeStats & {untrackedHabits: number};
	lastWeek: IDateRangeStats;
	lastMonth: IDateRangeStats;
}

export const getDashboardStats: Async.PromiseFn<IDashboardStats> = () =>
	_internal_api.get<IDashboardStats>("/dashboard-stats").then(response => response.data);
