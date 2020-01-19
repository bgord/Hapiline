import {IHabit} from "./IHabit";

export type Vote = "progress" | "plateau" | "regress" | null;

export interface IDayVote {
	vote_id: number;
	habit_id: IHabit["id"];
	vote: Vote;
	comment: string | null | undefined;
}

export interface IVoteChartItem {
	vote: Vote;
	day: string;
}

export interface IVoteComment {
	id: number;
	vote: Vote;
	day: string;
	comment: string;
}

export const voteToBgColor = new Map<Vote, string>();
voteToBgColor.set("progress", "bg-green-300");
voteToBgColor.set("plateau", "bg-gray-300");
voteToBgColor.set("regress", "bg-red-300");
voteToBgColor.set(null, "bg-gray-500");
