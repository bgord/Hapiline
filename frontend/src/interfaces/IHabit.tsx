import {IDayVote, Vote} from "./IDayVote";

export type HabitScoreType = "positive" | "neutral" | "negative";
export type HabitStrengthType = "established" | "developing" | "fresh";

export type HabitVote = {
	habit: IHabit;
	vote: Vote | undefined;
	comment: IDayVote["comment"];
	day: string;
	vote_id: IDayVote["vote_id"] | undefined;
};

export const HABIT_SCORES: {[key in HabitScoreType]: HabitScoreType} = {
	positive: "positive",
	neutral: "neutral",
	negative: "negative",
};

export const HABIT_STRENGTHS: {[key in HabitStrengthType]: HabitStrengthType} = {
	established: "established",
	developing: "developing",
	fresh: "fresh",
};

export interface IHabit {
	id: number;
	name: string;
	score: HabitScoreType;
	strength: HabitStrengthType;
	created_at: string;
	updated_at: string;
	order: number;
	description: string | null;
	progress_streak?: number;
	regress_streak?: number;
}

export const scoreToBgColor: {[key in HabitScoreType]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};

export const strengthToBgColor: {[key in HabitStrengthType]: string} = {
	established: "bg-blue-300",
	developing: "bg-blue-200",
	fresh: "bg-blue-100",
};
