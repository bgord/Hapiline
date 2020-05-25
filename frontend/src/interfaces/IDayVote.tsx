import {Habit, HabitVoteType} from "./index";

export interface IDayVote {
	vote_id: number;
	habit_id: Habit["id"];
	vote: HabitVoteType;
	comment: string | null | undefined;
}

export interface IVoteChartItem {
	vote: HabitVoteType;
	day: string;
}

export interface IVoteComment {
	id: number;
	vote: HabitVoteType;
	day: string;
	comment: string;
	habit_id: Habit["id"];
}

export const voteToBgColor = new Map<HabitVoteType, string>();
voteToBgColor.set("progress", "#8bdb90");
voteToBgColor.set("plateau", "var(--gray-3)");
voteToBgColor.set("regress", "#ef8790");
voteToBgColor.set(null, "var(--gray-9)");
