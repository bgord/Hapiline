import {IHabit} from "./interfaces/IHabit";

import React from "react";

const HABIT_SCORE_TYPES = ["positive", "neutral", "negative"];

interface EditableHabitScoreSelectInterface extends IHabit {}

export const EditableHabitScoreSelect: React.FC<EditableHabitScoreSelectInterface> = ({
	score,
}) => {
	const [newHabitScore, setNewHabitScore] = React.useState<IHabit["score"]>(
		score,
	);
	return (
		<select
			className="bg-gray-300 w-20 appearance-none cursor-pointer"
			value={newHabitScore}
			onChange={event => {
				const {value} = event.target;
				if (isHabitScore(value)) {
					setNewHabitScore(value);
				}
			}}
		>
			<option value="positive">Positive</option>
			<option value="neutral">Neutral</option>
			<option value="negative">Negative</option>
		</select>
	);
};

function isHabitScore(value: string): value is IHabit["score"] {
	return HABIT_SCORE_TYPES.includes(value);
}
