import * as Async from "react-async";

import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {
	Habit,
	DetailedHabit,
	NewHabitPayload,
	DayVote,
	HabitVote,
	HabitVoteChartDateRangeType,
} from "../interfaces/index";

export const getHabitsRequest = async (_key: "all_habits") =>
	_internal_api.get<Habit[]>("/habits").then(response => response.data);

export const getHabitRequest = async (_key: "single_habit", id: Habit["id"]) =>
	_internal_api.get<DetailedHabit>(`/habit/${id}`).then(response => response.data);

export const addHabitRequest = (newHabitPayload: NewHabitPayload) =>
	_internal_api.post<Habit>("/habit", newHabitPayload).then(response => response.data);

export const deleteHabitRequest = (id: Habit["id"]) =>
	_internal_api.delete(`/habit/${id}`).then(response => response.data);

export const patchHabitRequest: Async.DeferFn<DetailedHabit> = ([id, payload]) =>
	_internal_api.patch<DetailedHabit>(`/habit/${id}`, payload).then(response => response.data);

export const reorderHabitsRequest: Async.DeferFn<void> = ([reorderHabitsPayload]) =>
	_internal_api.patch("/reorder-habits", reorderHabitsPayload).then(response => response.data);

export const addHabitDayVoteRequest: Async.DeferFn<void> = ([habitDayVotePayload]) =>
	_internal_api.post("/vote", habitDayVotePayload).then(response => response.data);

export const getHabitVoteChartRequest = (
	_key: "habit_chart",
	id: Habit["id"],
	habitVoteChartDateRange: HabitVoteChartDateRangeType,
) =>
	_internal_api
		// TODO: Refactor the endpoint so that it accepts `habitVoteChartDateRange` in place of `dateRange`
		.get<DayVote[]>(constructUrl(`/habit-chart/${id}`, {dateRange: habitVoteChartDateRange}))
		.then(response => response.data);

export const updateVoteCommentRequest: Async.DeferFn<HabitVote> = ([id, comment]) =>
	_internal_api
		.patch<HabitVote>(`vote/${id}/comment`, {comment})
		.then(response => response.data);

export const getHabitVoteCommentsRequest = (_key: "comments", habitId: Habit["id"]) =>
	_internal_api
		.get<HabitVote[]>(constructUrl("/comments", {habitId: String(habitId)}))
		.then(response => response.data);
