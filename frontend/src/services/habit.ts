import * as Async from "react-async";

import {IHabit} from "../interfaces/IHabit";
import {_internal_api} from "./api";

export const getHabitsRequest: Async.PromiseFn<IHabit[]> = () =>
	_internal_api
		.get<IHabit[]>("/habit-scoreboard-items")
		.then(response => response.data);

export const addHabitRequest: Async.DeferFn<IHabit> = ([
	name,
	score,
	user_id,
]: string[]) =>
	_internal_api
		.post<IHabit>("/habit-scoreboard-item", {
			name,
			score,
			user_id,
		})
		.then(response => response.data);

export const deleteHabitRequest: Async.DeferFn<void> = ([id]: number[]) =>
	_internal_api
		.delete(`/habit-scoreboard-item/${id}`)
		.then(response => response.data);

export const patchHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	_internal_api
		.patch<IHabit>(`/habit-scoreboard-item/${id}`, payload)
		.then(response => response.data);
