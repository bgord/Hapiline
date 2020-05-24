import {users, habits} from "@prisma/client";

export type User = users;
export type Habit = habits;

export type NewHabitPayload = Omit<Habit, "id" | "created_at" | "updated_at" | "user_id" | "order">;
