export interface IHabit {
	id: number;
	name: string;
	score: "positive" | "neutral" | "negative";
	created_at: string;
	updated_at: string;
	order: number;
}

export const scoreToBgColor: {[key in IHabit["score"]]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};
