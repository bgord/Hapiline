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
export type UserProfile = Pick<User, "id" | "email">;

// =============

// Habits
export type Habit = habits;
export type DetailedHabit = habits & {
  progress_streak: number;
  regress_streak: number;
};
export type NewHabitPayload = Omit<
  Habit,
  "id" | "created_at" | "updated_at" | "order"
>;

export type { HabitStrength as HabitStrengthType } from "@prisma/client";
export const HabitStrengths: { [key in HabitStrengthType]: HabitStrengthType } =
  {
    established: "established",
    developing: "developing",
    fresh: "fresh",
  };
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
export type DayVote = {
  day: HabitVote["day"];
  vote: HabitVoteType;
}

export const voteToBgColor = new Map<HabitVoteType, string>();
voteToBgColor.set("progress", "#8bdb90");
voteToBgColor.set("plateau", "var(--gray-3)");
voteToBgColor.set("regress", "#ef8790");
voteToBgColor.set(null, "var(--gray-9)");
