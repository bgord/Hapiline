import { users, habits } from "@prisma/client";
import type { HabitStrength as HabitStrengthType } from "@prisma/client";
import type { HabitScore as HabitScoreType } from "@prisma/client";

export type User = users;

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
  const possibleHabitStrengthValues = Object.keys(HabitStrengths)

  return possibleHabitStrengthValues.includes(value);
}

export type { HabitScore as HabitScoreType } from "@prisma/client";
export const HabitScores: { [key in HabitScoreType]: HabitScoreType } =
  {
    positive: "positive",
    neutral: "neutral",
    negative: "negative"
  };
export function isHabitScore(value: any): value is Habit["score"] {
  const possibleHabitScoresValues = Object.keys(HabitScores)

  return possibleHabitScoresValues.includes(value);
}
