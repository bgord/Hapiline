import {Habit, HabitVoteType} from "./index";

export interface IVoteComment {
	id: number;
	vote: HabitVoteType;
	day: string;
	comment: string;
	habit_id: Habit["id"];
}
