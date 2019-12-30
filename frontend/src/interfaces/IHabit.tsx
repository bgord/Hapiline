type Score = "positive" | "neutral" | "negative";
type Strength = "established" | "developing" | "fresh";

export interface IHabit {
	id: number;
	name: string;
	score: Score;
	strength: Strength;
	created_at: string;
	updated_at: string;
	order: number;
}

export const scoreToBgColor: {[key in Score]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};

export const strengthToBgColor: {[key in Strength]: string} = {
	established: "bg-blue-300",
	developing: "bg-blue-200",
	fresh: "bg-blue-100",
};
