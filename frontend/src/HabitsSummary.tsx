import React from "react";
import {IHabit, scoreToBgColor, strengthToBgColor} from "./interfaces/IHabit";

export const HabitsSummary: React.FC<{habits: IHabit[]}> = ({habits}) => {
	const positiveHabitsCount = habits.filter(habit => habit.score === "positive")
		.length;
	const negativeHabitsCount = habits.filter(habit => habit.score === "negative")
		.length;
	const neutralHabitsCount = habits.filter(habit => habit.score === "neutral")
		.length;

	const establishedHabitsCount = habits.filter(
		habit => habit.strength === "established",
	).length;
	const fragileHabitsCount = habits.filter(
		habit => habit.strength === "fragile",
	).length;
	const developingHabitsCount = habits.filter(
		habit => habit.strength === "developing",
	).length;

	const totalHabitsCount = habits.length;

	return (
		<div className="flex justify-baseline self-start mt-16 mb-6">
			<div className={`mr-1 px-1 ${scoreToBgColor.positive}`}>
				positive: {positiveHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.neutral}`}>
				neutral: {neutralHabitsCount}
			</div>
			<div className={`ml-2 px-1 ${scoreToBgColor.negative}`}>
				negative: {negativeHabitsCount}
			</div>
			<span className="mx-4">|</span>
			<div className={`mr-1 px-1 ${strengthToBgColor.established}`}>
				established: {establishedHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${strengthToBgColor.fragile}`}>
				fragile: {fragileHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${strengthToBgColor.developing}`}>
				developing: {developingHabitsCount}
			</div>

			<span className="mx-4">|</span>
			<div className="mr-1">total: {totalHabitsCount}</div>
		</div>
	);
};
