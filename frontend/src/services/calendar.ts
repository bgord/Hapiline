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

type Vote = "progress" | "plateau" | "regress" | null;

export interface DayVotes {
	habit_id: IHabit["id"];
	vote: Vote;
}

export const getDayRequest: Async.PromiseFn<DayVotes[]> = ({day}) =>
	_internal_api.get<DayVotes[]>(`/day-votes?day=${day}`).then(response => response.data);
