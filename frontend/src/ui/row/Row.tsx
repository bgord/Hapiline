import "./row.css";

import React from "react";

import {Margins} from "../margins";

type MainAxisAlignment = "start" | "between" | "end";
type CrossAxisAlignment = "start" | "center" | "baseline" | "end";

export const Row: React.FC<JSX.IntrinsicElements["div"] &
	Margins & {
		mainAxis?: MainAxisAlignment;
		crossAxis?: CrossAxisAlignment;
	}> = ({mainAxis = "start", crossAxis = "center", mt, mr, mb, ml, ...props}) => (
	<div
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		data-main-axis={mainAxis}
		data-cross-axis={crossAxis}
		className="c-row"
		{...props}
	/>
);
