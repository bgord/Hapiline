import React from "react";

import {IHabit, strengthToBgColor} from "./interfaces/IHabit";

export const HabitStrength: React.FC<{
	strength: IHabit["strength"];
} & JSX.IntrinsicElements["div"]> = ({strength, className = "", ...rest}) => {
	const strengthBgColor = strengthToBgColor[strength];
	return (
		<div className={`${strengthBgColor} w-32 ml-2 pl-1 p-2 text-center ${className}`} {...rest}>
			{strength}
		</div>
	);
};
