import {IDayVote} from "./IDayVote";
import {BadgeVariant} from "../ui/badge/Badge";

import type {HabitStrengthType, HabitScoreType, HabitVoteType} from "./index";

export type HabitVote = {
	habit: IHabit;
	vote: HabitVoteType | undefined;
	comment: IDayVote["comment"];
	day: string;
	vote_id: IDayVote["vote_id"] | undefined;
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
	[key in HabitStrengthType]: BadgeVariant;
} = {
	fresh: "light",
	developing: "normal",
	established: "strong",
};
