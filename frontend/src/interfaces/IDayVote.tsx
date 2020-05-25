import {Habit, HabitVoteType} from "./index";

export interface IDayVote {
	vote_id: number;
	habit_id: Habit["id"];
	vote: HabitVoteType;
	comment: string | null | undefined;
}

export interface IVoteComment {
	id: number;
	vote: HabitVoteType;
	day: string;
	comment: string;
	habit_id: Habit["id"];
}
