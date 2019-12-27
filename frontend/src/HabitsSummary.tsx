import React from "react";
import {IHabit} from "./interfaces/IHabit";
import {scoreToBgColor} from "./HabitList";

export const HabitsSummary: React.FC<{habits: IHabit[]}> = ({habits}) => {
	const howManyPositiveHabits = habits.filter(
		habit => habit.score === "positive",
	).length;

	const howManyNegativeHabits = habits.filter(
		habit => habit.score === "negative",
	).length;

	const howManyNeutralHabits = habits.filter(habit => habit.score === "neutral")
		.length;

	const howManyHabitInTotal = habits.length;

	return (
		<div className="flex justify-end mt-12 mb-2">
			<div className="ml-2">
				<span className={`mr-1 px-1 ${scoreToBgColor.positive}`}>
					Positive:
				</span>
				<span>{howManyPositiveHabits}</span>
			</div>
			<div className="ml-2">
				<span className={`mr-1 px-1 ${scoreToBgColor.neutral}`}>Neutral:</span>
				<span>{howManyNeutralHabits}</span>
			</div>
			<div className="ml-2">
				<span className={`mr-1 px-1 ${scoreToBgColor.negative}`}>
					Negative:
				</span>
				<span>{howManyNegativeHabits}</span>
			</div>
			<div className="ml-2">
				<span className="mr-1">Total:</span>
				<span>{howManyHabitInTotal}</span>
			</div>
		</div>
	);
};
