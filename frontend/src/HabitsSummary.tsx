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
		<div className="flex justify-end self-start flex-col mt-12 mb-6">
			<div className="mr-1 mb-2">total: {totalHabitsCount}</div>
			<div className="flex">
				<div className={`mr-1 px-1 ${scoreToBgColor.positive}`}>
					positive: {positiveHabitsCount}
				</div>
				<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.neutral}`}>
					neutral: {neutralHabitsCount}
				</div>
				<div className={`ml-2 mr-1 px-1 ${scoreToBgColor.negative}`}>
					negative: {negativeHabitsCount}
				</div>
			</div>
		</div>
	);
};
