import {IDayVote} from "./IDayVote";

import type { HabitVoteType, Habit} from "./index";

export type HabitVote = {
	habit: Habit;
	vote: HabitVoteType | undefined;
	comment: IDayVote["comment"];
	day: string;
	vote_id: IDayVote["vote_id"] | undefined;
};
