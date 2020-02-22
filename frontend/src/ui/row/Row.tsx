import "./row.css";

import React from "react";

type MainAxisAlignment = "start" | "between" | "end";
type CrossAxisAlignment = "start" | "center" | "baseline" | "end";

export const Row: React.FC<JSX.IntrinsicElements["div"] & {
	mainAxis?: MainAxisAlignment;
	crossAxis?: CrossAxisAlignment;
}> = ({mainAxis = "start", crossAxis = "center", ...props}) => (
	<div data-main-axis={mainAxis} data-cross-axis={crossAxis} className="c-row" {...props} />
);
