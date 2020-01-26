import * as Async from "react-async";

import {_internal_api} from "./api";

interface ITodayStats {
	progressVotes: number;
	plateauVotes: number;
	regressVotes: number;
	allHabits: number;
	noVotes: number;
	allVotes: number;
}

interface IDateRangeStats {
	progressVotes: number;
	plateauVotes: number;
	regressVotes: number;
	noVotes: number;
	allVotes: number;
	maximumVotes: number;
}

interface IDashboardStats {
	today: ITodayStats;
	lastWeek: IDateRangeStats;
	lastMonth: IDateRangeStats;
}

export const getDashboardStats: Async.PromiseFn<IDashboardStats> = () =>
	_internal_api.get<IDashboardStats>("/dashboard-stats").then(response => response.data);
