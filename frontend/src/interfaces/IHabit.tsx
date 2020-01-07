export type HabitScore = "positive" | "neutral" | "negative";
export type HabitStrength = "established" | "developing" | "fresh";

export interface IHabit {
	id: number;
	name: string;
	score: HabitScore;
	strength: HabitStrength;
	created_at: string;
	updated_at: string;
	order: number;
	progress_streak?: number;
	regress_streak?: number;
}

export const scoreToBgColor: {[key in HabitScore]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};

export const strengthToBgColor: {[key in HabitStrength]: string} = {
	established: "bg-blue-300",
	developing: "bg-blue-200",
	fresh: "bg-blue-100",
};
