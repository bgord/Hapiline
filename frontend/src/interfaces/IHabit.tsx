import {IDayVote, Vote} from "./IDayVote";
import {BadgeVariant} from "../ui/badge/Badge";

import type {HabitStrengthType} from "./index";

export type HabitScoreType = "positive" | "neutral" | "negative";

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
	is_trackable: boolean;
}

export const habitStrengthToBadgeVariant: {
	[key in IHabit["strength"]]: BadgeVariant;
} = {
	fresh: "light",
	developing: "normal",
	established: "strong",
};
