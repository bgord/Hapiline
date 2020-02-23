import "./column.css";

import React from "react";

import {Alignments} from "../alignments";
import {Margins} from "../margins";

type ColumnProps = JSX.IntrinsicElements["div"] & Margins & Alignments;

export const Column: React.FC<ColumnProps> = ({mt, mr, mb, ml, mainAxis, crossAxis, ...props}) => (
	<div
		data-main-axis={mainAxis}
		data-cross-axis={crossAxis}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className="c-column"
		{...props}
	/>
);
