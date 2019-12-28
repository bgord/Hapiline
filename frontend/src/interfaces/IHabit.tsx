export interface IHabit {
	id: number;
	name: string;
	score: "positive" | "neutral" | "negative";
	strength: "established" | "developing" | "fresh";
	created_at: string;
	updated_at: string;
	order: number;
}

export const scoreToBgColor: {[key in IHabit["score"]]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};

export const strengthToBgColor: {[key in IHabit["strength"]]: string} = {
	established: "bg-blue-300",
	developing: "bg-blue-200",
	fresh: "bg-blue-100",
};
