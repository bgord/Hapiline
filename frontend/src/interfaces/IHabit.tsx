export interface IHabit {
	id: number;
	name: string;
	score: "positive" | "neutral" | "negative";
	created_at: string;
	updated_at: string;
}
