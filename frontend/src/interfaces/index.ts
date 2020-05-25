import { users, habits, notifications, habit_votes } from "@prisma/client";

/* eslint-disable no-duplicate-imports */
import type {
  HabitStrength as HabitStrengthType,
  HabitScore as HabitScoreType,
  NotificationStatus,
  NotificationType,
  HabitVote as _HabitVoteType,
} from "@prisma/client";

// Users
export type User = users;
export type UserProfile = Pick<User, "id" | "email">;

// =============

// Habits
export type Habit = habits;
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
