import * as Async from "react-async";

import {IHabit} from "../interfaces/IHabit";
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

export type Vote = "progress" | "plateau" | "regress" | null;

export interface DayVote {
	habit_id: IHabit["id"];
	vote: Vote;
}

export const getDayRequest: Async.PromiseFn<DayVote[]> = ({day}) =>
	_internal_api.get<DayVote[]>(`/day-votes?day=${day}`).then(response => response.data);
