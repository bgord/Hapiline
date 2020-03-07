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
	habit_id: IHabit["id"];
}

export const voteToBgColor = new Map<Vote, string>();
voteToBgColor.set("progress", "#8bdb90");
voteToBgColor.set("plateau", "var(--gray-3)");
voteToBgColor.set("regress", "#ef8790");
voteToBgColor.set(null, "var(--gray-9)");
