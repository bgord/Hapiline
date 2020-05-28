import { users, habits, notifications, habit_votes } from "@prisma/client";

/* eslint-disable no-duplicate-imports */
import type {
  HabitStrength as HabitStrengthType,
  HabitScore as HabitScoreType,
  NotificationStatus,
  NotificationType,
  HabitVote as _HabitVoteType,
} from "@prisma/client";
import {BadgeVariant} from "../ui/badge/Badge";

// Users
export type User = users;
export type NewUserPayload = Pick<User, "email" | "password"> & {
  passwordConfirmation: User["password"];
};
export type UserProfile = Pick<User, "id" | "email">;

export type LoginPayload = Pick<User, "email" | "password">;
export type NewPasswordPayload = {
  token: Token;
  password: User["password"];
  passwordConfirmation: User["password"];
}
export type NewEmailPayload = {
  newEmail: User["email"];
  password: User["password"];
}
export type UpdatePasswordPayload = {
	old_password: User["password"];
	password: User["password"];
	password_confirmation: User["password"];
}

// =============

// Habits
export type Habit = habits;
export type HabitWithPossibleHabitVote = Habit & {
  vote: Nullable<HabitVote>;
}

export type HabitStreaks = {
  progress_streak: number;
  regress_streak: number;
}

export type DetailedHabit = Habit & HabitStreaks;

export type NewHabitPayload = Omit<
  Habit,
  "id" | "created_at" | "updated_at" | "order"
>;

export type DraftHabitPayload = Partial<Pick<Habit, "id" | "description" | "name" | "score" | "strength">> & {
  id: Habit["id"];
}

export type ReorderHabitPayload = {
  id: Habit["id"];
  index: Habit["order"];
}

export type { HabitStrength as HabitStrengthType } from "@prisma/client";
export const HabitStrengths: { [key in HabitStrengthType]: HabitStrengthType } =
  {
    established: "established",
    developing: "developing",
    fresh: "fresh",
  };

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isHabitStrength(value: any): value is Habit["strength"] {
  const possibleHabitStrengthValues = Object.keys(HabitStrengths);

  return possibleHabitStrengthValues.includes(value);
}
export const habitStrengthToBadgeVariant: {
	[key in HabitStrengthType]: BadgeVariant;
} = {
	fresh: "light",
	developing: "normal",
	established: "strong",
};

export type { HabitScore as HabitScoreType } from "@prisma/client";
export const HabitScores: { [key in HabitScoreType]: HabitScoreType } = {
  positive: "positive",
  neutral: "neutral",
  negative: "negative",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isHabitScore(value: any): value is Habit["score"] {
  const possibleHabitScoresValues = Object.keys(HabitScores);

  return possibleHabitScoresValues.includes(value);
}

// =============

// Notifications

export type Notification = notifications;
export type DraftNotificationPayload = Pick<Notification, "id" | "status">;
export type NotificationStatusType = NotificationStatus;
export type NotificationTypeStatus = NotificationType;

// =============

// Votes

export type HabitVote = habit_votes;

export type HabitVoteType = Nullable<_HabitVoteType>;

export type HabitVotePayload = Pick<HabitVote, "habit_id" | "vote" | "day" | "comment">

export type HabitVoteCommentPayload = Pick<HabitVote, "id" | "comment">;

export type DayVote = {
  day: HabitVote["day"];
  vote: HabitVoteType;
}

export const voteToBgColor = new Map<HabitVoteType, string>();
voteToBgColor.set("progress", "#8bdb90");
voteToBgColor.set("plateau", "var(--gray-3)");
voteToBgColor.set("regress", "#ef8790");
voteToBgColor.set(null, "var(--gray-9)");

export type HabitVoteChartDateRangeType = "last_week" | "last_month" | "all_time";

export const HabitVoteChartDateRanges: {[key in HabitVoteChartDateRangeType]: HabitVoteChartDateRangeType} = {
	last_week: "last_week",
	last_month: "last_month",
	all_time: "all_time",
};


// =============

// Stats

export interface DayCell {
	day: string;
	styles: {gridColumnStart: React.CSSProperties["gridColumnStart"]};
}

export interface DayStatsFromServer {
	day: string;
	createdHabitsCount: number;
	progressVotesCountStats: number;
	plateauVotesCountStats: number;
	regressVotesCountStats: number;
	nullVotesCountStats: number;
}

export type DayCellWithFullStats = DayCell & DayStatsFromServer & {
  noVotesCountStats: number;
};

// ===========

// Dashboard

export type DashboardStreakStats = {
	progress_streaks: {
		id: Habit["id"];
		name: Habit["name"];
		created_at: Habit["created_at"];
		progress_streak: HabitStreaks["progress_streak"];
	}[];

	regress_streaks: {
		id: Habit["id"];
		name: Habit["name"];
		created_at: Habit["created_at"];
		regress_streak: HabitStreaks["regress_streak"];
	}[];
}

type DashboardHabitVoteStats =  {
	progressVotes: number;
	plateauVotes: number;
	regressVotes: number;
	noVotes: number;
	allVotes: number;
	maximumVotes: number;
}

export type DashboardHabitVoteStatsForDateRanges = {
	today: DashboardHabitVoteStats & {untrackedHabits: number};
	lastWeek: DashboardHabitVoteStats;
	lastMonth: DashboardHabitVoteStats;
}

// ===========

// Token

export type Token = string;
