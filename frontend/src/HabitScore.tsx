import React from "react";

import {IHabit, scoreToBgColor} from "./interfaces/IHabit";

export const HabitScore: React.FC<{score: IHabit["score"]} & JSX.IntrinsicElements["div"]> = ({
	score,
	className = "",
	...rest
}) => (
	<div className={`c-text ${scoreToBgColor[score]} w-24 p-1 text-center ${className}`} {...rest}>
		{score}
	</div>
);
