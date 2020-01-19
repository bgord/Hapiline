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
