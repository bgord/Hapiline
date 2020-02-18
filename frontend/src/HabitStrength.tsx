import React from "react";

import {IHabit, strengthToBgColor} from "./interfaces/IHabit";

export const HabitStrength: React.FC<{
	strength: IHabit["strength"];
} & JSX.IntrinsicElements["div"]> = ({strength, className = "", ...rest}) => {
	const strengthBgColor = strengthToBgColor[strength];
	return (
		<div className={`c-text ${strengthBgColor} w-32 ml-2 p-1 text-center ${className}`} {...rest}>
			{strength}
		</div>
	);
};
