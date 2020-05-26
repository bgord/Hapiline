import {isBefore, isSameDay} from "date-fns";

import {Habit} from "../interfaces/index";

export function getHabitsAvailableAtThisDay(habits: Habit[], day: string | Date): Habit[] {
	return habits.filter(habit => {
		// TODO: make {created,updated}_at required
		if (!habit.created_at) return false;

		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});
}
