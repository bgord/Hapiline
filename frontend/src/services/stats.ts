import * as Async from "react-async";

import {_internal_api} from "./api";

interface IStats {
	progressVotes: number;
	plateauVotes: number;
	regressVotes: number;
	allHabits: number;
	noVotes: number;
	allVotes: number;
}

export const getDashboardStats: Async.PromiseFn<{today: IStats}> = () =>
	_internal_api.get<{today: IStats}>("/dashboard-stats").then(response => response.data);
