import React from "react";

import {scoreToBgColor, strengthToBgColor} from "./interfaces/IHabit";
import {useHabits} from "./contexts/habits-context";

export const HabitsSummary: React.FC = () => {
	const getHabitsRequestState = useHabits();

	const habits = getHabitsRequestState?.data ?? [];

	const positiveHabitsCount = habits.filter(habit => habit.score === "positive").length;
	const negativeHabitsCount = habits.filter(habit => habit.score === "negative").length;
	const neutralHabitsCount = habits.filter(habit => habit.score === "neutral").length;

	const establishedHabitsCount = habits.filter(habit => habit.strength === "established").length;
	const developingHabitsCount = habits.filter(habit => habit.strength === "developing").length;
	const freshHabitsCount = habits.filter(habit => habit.strength === "fresh").length;

	const totalHabitsCount = habits.length;

	return (
		<div className="flex justify-baseline self-start mt-16 mb-6 ml-4">
			<div className={`mr-1 px-1 ${scoreToBgColor.positive}`}>positive: {positiveHabitsCount}</div>
			<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.neutral}`}>
				neutral: {neutralHabitsCount}
			</div>
			<div className={`ml-2 px-1 ${scoreToBgColor.negative}`}>negative: {negativeHabitsCount}</div>
			<span className="mx-4">|</span>
			<div className={`mr-1 px-1 ${strengthToBgColor.established}`}>
				established: {establishedHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${strengthToBgColor.developing}`}>
				developing: {developingHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${strengthToBgColor.fresh}`}>fresh: {freshHabitsCount}</div>

			<span className="mx-4">|</span>
			<div className="mr-1">total: {totalHabitsCount}</div>
		</div>
	);
};
