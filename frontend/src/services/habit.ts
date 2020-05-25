import * as Async from "react-async";

import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {Habit, DetailedHabit, NewHabitPayload, DayVote, HabitVote} from "../interfaces/index";

export const getHabitsRequest: Async.PromiseFn<Habit[]> = () =>
	_internal_api.get<Habit[]>("/habits").then(response => response.data);

export const getHabitRequest: Async.PromiseFn<DetailedHabit> = ({id}) =>
	_internal_api.get<DetailedHabit>(`/habit/${id}`).then(response => response.data);

export const addHabitRequest: Async.DeferFn<Habit> = ([newHabitPayload]: NewHabitPayload[]) =>
	_internal_api.post<Habit>("/habit", newHabitPayload).then(response => response.data);

export const deleteHabitRequest: Async.DeferFn<void> = ([id]: number[]) =>
	_internal_api.delete(`/habit/${id}`).then(response => response.data);

export const patchHabitRequest: Async.DeferFn<DetailedHabit> = ([id, payload]) =>
	_internal_api.patch<DetailedHabit>(`/habit/${id}`, payload).then(response => response.data);

export const reorderHabitsRequest: Async.DeferFn<void> = ([reorderHabitsPayload]) =>
	_internal_api.patch("/reorder-habits", reorderHabitsPayload).then(response => response.data);

export const addHabitDayVoteRequest: Async.DeferFn<void> = ([habitDayVotePayload]) =>
	_internal_api.post("/vote", habitDayVotePayload).then(response => response.data);

export const getHabitVoteChartRequest: Async.PromiseFn<DayVote[]> = ({id, dateRange}) =>
	_internal_api
		.get<DayVote[]>(constructUrl(`/habit-chart/${id}`, {dateRange}))
		.then(response => response.data);

export const updateVoteCommentRequest: Async.DeferFn<HabitVote> = ([id, comment]) =>
	_internal_api
		.patch<HabitVote>(`vote/${id}/comment`, {comment})
		.then(response => response.data);

export const getHabitVoteCommentsRequest: Async.PromiseFn<HabitVote[]> = ({habitId}) =>
	_internal_api
		.get<HabitVote[]>(constructUrl("/comments", {habitId}))
		.then(response => response.data);
