import * as Async from "react-async";

import {IHabit} from "../interfaces/IHabit";
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

interface IDashboardStreakStats {
	progress_streaks: {
		id: IHabit["id"];
		name: IHabit["name"];
		created_at: IHabit["created_at"];
		progress_streak: number;
	}[];

	regress_streaks: {
		id: IHabit["id"];
		name: IHabit["name"];
		created_at: IHabit["created_at"];
		regress_streak: number;
	}[];
}

export const getDashboardStreakStats: Async.PromiseFn<IDashboardStreakStats> = () =>
	_internal_api
		.get<IDashboardStreakStats>("/dashboard-streak-stats")
		.then(response => response.data);
