import {isBefore, isSameDay} from "date-fns";

import {Habit} from "../interfaces/index";

export function getHabitsAvailableAtThisDay(habits: Habit[], day: string | Date): Habit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});
}
