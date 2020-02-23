import "./row.css";

import React from "react";

import {Alignments} from "../alignments";
import {Margins} from "../margins";

export const Row: React.FC<JSX.IntrinsicElements["div"] & Margins & Alignments> = ({
	mainAxis = "start",
	crossAxis = "center",
	mt,
	mr,
	mb,
	ml,
	...props
}) => (
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
