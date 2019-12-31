import {isBefore, isSameDay} from "date-fns";

import {IHabit} from "../interfaces/IHabit";

export function getHabitsAvailableAtThisDay(habits: IHabit[], day: string | Date): IHabit[] {
	return habits.filter(habit => {
		const createdAtDate = new Date(habit.created_at);
		const dayDate = new Date(day);

		return isSameDay(createdAtDate, dayDate) || isBefore(createdAtDate, dayDate);
	});
}
