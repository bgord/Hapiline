import {IHabit} from "./IHabit";

export type Vote = "progress" | "plateau" | "regress" | null;

export interface IDayVote {
	habit_id: IHabit["id"];
	vote: Vote;
	comment: string | null | undefined;
}

export interface IVoteChartItem {
	vote: Vote;
	day: string;
}
