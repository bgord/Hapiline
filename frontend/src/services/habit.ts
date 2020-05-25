import * as Async from "react-async";

import {IDayVote, IVoteChartItem, IVoteComment} from "../interfaces/IDayVote";
import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {Habit, DetailedHabit, NewHabitPayload} from "../interfaces/index";

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

export const getHabitVoteChartRequest: Async.PromiseFn<IVoteChartItem[]> = ({id, dateRange}) =>
	_internal_api
		.get<IVoteChartItem[]>(constructUrl(`/habit-chart/${id}`, {dateRange}))
		.then(response => response.data);

export const updateVoteCommentRequest: Async.DeferFn<IDayVote> = ([id, comment]) =>
	_internal_api
		.patch<IDayVote>(`vote/${id}/comment`, {comment})
		.then(response => response.data);

export const getHabitVoteCommentsRequest: Async.PromiseFn<IVoteComment[]> = ({habitId}) =>
	_internal_api
		.get<IVoteComment[]>(constructUrl("/comments", {habitId}))
		.then(response => response.data);
