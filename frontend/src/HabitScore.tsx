import React from "react";

import {IHabit, scoreToBgColor} from "./interfaces/IHabit";

export const HabitScore: React.FC<{score: IHabit["score"]} & JSX.IntrinsicElements["div"]> = ({
	score,
	className = "",
	...rest
}) => {
	const scoreBgColor = scoreToBgColor[score];
	console.log(className);
	return (
		<div className={`${scoreBgColor} w-24 pl-1 p-2 text-center ${className}`} {...rest}>
			{score}
		</div>
	);
};
