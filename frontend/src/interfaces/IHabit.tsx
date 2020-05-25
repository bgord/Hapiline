import {IDayVote} from "./IDayVote";
import {BadgeVariant} from "../ui/badge/Badge";

import type {HabitStrengthType, HabitVoteType, Habit} from "./index";

export type HabitVote = {
	habit: Habit;
	vote: HabitVoteType | undefined;
	comment: IDayVote["comment"];
	day: string;
	vote_id: IDayVote["vote_id"] | undefined;
};

export const habitStrengthToBadgeVariant: {
	[key in HabitStrengthType]: BadgeVariant;
} = {
	fresh: "light",
	developing: "normal",
	established: "strong",
};
