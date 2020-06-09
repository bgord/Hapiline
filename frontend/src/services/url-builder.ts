import {constructUrl} from "../hooks/useQueryParam";
import {Habit} from "../interfaces/index";
import {formatDay} from "../config/DATE_FORMATS";

export const UrlBuilder = {
	habits: {
		preview: (habitId: Habit["id"]): string =>
			constructUrl("habits", {
				preview_habit_id: habitId.toString(),
			}),
	},
	dashboard: {
		habit: {
			preview: (habitId: Habit["id"]): string =>
				constructUrl("dashboard", {
					subview: "habit_preview",
					preview_habit_id: habitId.toString(),
				}),
		},
	},
	calendar: {
		day: {
			habit: ({day, habitId}: {day: Date; habitId: Habit["id"]}): string =>
				constructUrl("calendar", {
					preview_day: formatDay(day),
					highlighted_habit_id: habitId.toString(),
				}),
		},
	},
};
