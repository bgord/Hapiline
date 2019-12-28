import React from "react";
import {IHabit, scoreToBgColor} from "./interfaces/IHabit";

export const HabitsSummary: React.FC<{habits: IHabit[]}> = ({habits}) => {
	const positiveHabitsCount = habits.filter(habit => habit.score === "positive")
		.length;
	const negativeHabitsCount = habits.filter(habit => habit.score === "negative")
		.length;
	const neutralHabitsCount = habits.filter(habit => habit.score === "neutral")
		.length;
	const totalHabitsCount = habits.length;

	return (
		<div className="flex justify-end mt-12 mb-3">
			<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.positive}`}>
				Positive: {positiveHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.neutral}`}>
				Neutral: {neutralHabitsCount}
			</div>
			<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.negative}`}>
				Negative: {negativeHabitsCount}
			</div>
			<div className="mr-1 ml-2">Total: {totalHabitsCount}</div>
		</div>
	);
};