export type HabitScoreType = "positive" | "neutral" | "negative";
export type HabitStrength = "established" | "developing" | "fresh";

export const HABIT_SCORES: {[key in HabitScoreType]: HabitScoreType} = {
	positive: "positive",
	neutral: "neutral",
	negative: "negative",
};

export interface IHabit {
	id: number;
	name: string;
	score: HabitScoreType;
	strength: HabitStrength;
	created_at: string;
	updated_at: string;
	order: number;
	progress_streak?: number;
	regress_streak?: number;
}

export const scoreToBgColor: {[key in HabitScoreType]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};

export const strengthToBgColor: {[key in HabitStrength]: string} = {
	established: "bg-blue-300",
	developing: "bg-blue-200",
	fresh: "bg-blue-100",
};
