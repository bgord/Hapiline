import {DashboardStreakStats, DashboardHabitVoteStatsForDateRanges} from "../interfaces/index";
import {_internal_api} from "./api";

export const getDashboardStats = (_key: "dashboard_stats") =>
	_internal_api
		.get<DashboardHabitVoteStatsForDateRanges>("/dashboard-stats")
		.then(response => response.data);

export const getDashboardStreakStats = (_key: "dashboard_streak_stats") =>
	_internal_api
		.get<DashboardStreakStats>("/dashboard-streak-stats")
		.then(response => response.data);
