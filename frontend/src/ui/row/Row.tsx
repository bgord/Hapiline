import "./row.css";

import React from "react";

import {Alignments} from "../alignments";
import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Widths} from "../widths";

type RowProps = JSX.IntrinsicElements["div"] & Margins & Alignments & Widths & Paddings;

export const Row: React.FC<RowProps> = ({
	mainAxis = "start",
	crossAxis = "center",
	width,
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	...props
}) => (
	<div
		data-main-axis={mainAxis}
		data-cross-axis={crossAxis}
		data-width={width}
		data-p={p}
		data-px={px}
		data-py={py}
		data-pt={pt}
		data-pr={pr}
		data-pb={pb}
		data-pl={pl}
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className="c-row"
		{...props}
	/>
);
