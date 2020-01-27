import * as Async from "react-async";

import {IDayVote, IVoteChartItem, IVoteComment} from "../interfaces/IDayVote";
import {IHabit} from "../interfaces/IHabit";
import {_internal_api} from "./api";

export const getHabitsRequest: Async.PromiseFn<IHabit[]> = () =>
	_internal_api.get<IHabit[]>("/habits").then(response => response.data);

export const getHabitRequest: Async.PromiseFn<IHabit> = ({id}) =>
	_internal_api.get<IHabit>(`/habit/${id}`).then(response => response.data);

export const addHabitRequest: Async.DeferFn<IHabit> = ([
	name,
	score,
	strength,
	user_id,
	description,
	is_trackable,
]: string[]) =>
	_internal_api
		.post<IHabit>("/habit", {
			name,
			score,
			strength,
			user_id,
			description,
			is_trackable,
		})
		.then(response => response.data);

export const deleteHabitRequest: Async.DeferFn<void> = ([id]: number[]) =>
	_internal_api.delete(`/habit/${id}`).then(response => response.data);

export const patchHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	_internal_api.patch<IHabit>(`/habit/${id}`, payload).then(response => response.data);

export const reorderHabitsRequest: Async.DeferFn<void> = ([reorderHabitsPayload]) =>
	_internal_api.patch("/reorder-habits", reorderHabitsPayload).then(response => response.data);

export const addHabitDayVoteRequest: Async.DeferFn<void> = ([habitDayVotePayload]) =>
	_internal_api.post("/vote", habitDayVotePayload).then(response => response.data);

export const getHabitVoteChartRequest: Async.PromiseFn<IVoteChartItem[]> = ({id, dateRange}) =>
	_internal_api
		.get<IVoteChartItem[]>(`/habit-chart/${id}?dateRange=${dateRange}`)
		.then(response => response.data);

export const updateVoteCommentRequest: Async.DeferFn<IDayVote> = ([id, comment]) =>
	_internal_api
		.patch<IDayVote>(`vote/${id}/comment`, {comment})
		.then(response => response.data);

export const getHabitVoteCommentsRequest: Async.PromiseFn<IVoteComment[]> = ({habitId}) =>
	_internal_api.get<IVoteComment[]>(`/comments?habitId=${habitId}`).then(response => response.data);
