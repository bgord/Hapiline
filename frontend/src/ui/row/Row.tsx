import "./row.css";

import React from "react";

import {Alignments} from "../alignments";
import {Margins} from "../margins";
import {Widths} from "../widths";

type RowProps = JSX.IntrinsicElements["div"] & Margins & Alignments & Widths;

export const Row: React.FC<RowProps> = ({
	mainAxis = "start",
	crossAxis = "center",
	width,
	mt,
	mr,
	mb,
	ml,
	...props
}) => (
	<div
		data-main-axis={mainAxis}
		data-cross-axis={crossAxis}
		data-width={width}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className="c-row"
		{...props}
	/>
);
