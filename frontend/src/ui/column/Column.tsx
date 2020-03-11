import "./column.css";

import React from "react";

import {Alignments} from "../alignments";
import {Margins} from "../margins";
import {Paddings} from "../paddings";

type ColumnProps = React.ComponentPropsWithoutRef<"div"> & Margins & Alignments & Paddings;

/* eslint-disable prefer-arrow-callback */
export const Column = React.forwardRef(function _Column(
	{
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
		mainAxis,
		crossAxis,
		...props
	}: ColumnProps,
	ref: React.Ref<HTMLDivElement>,
) {
	return (
		<div
			ref={ref}
			data-main-axis={mainAxis}
			data-cross-axis={crossAxis}
			data-m={m}
			data-mx={mx}
			data-my={my}
			data-mt={mt}
			data-mr={mr}
			data-mb={mb}
			data-ml={ml}
			data-p={p}
			data-px={px}
			data-py={py}
			data-pt={pt}
			data-pr={pr}
			data-pb={pb}
			data-pl={pl}
			className="c-column"
			{...props}
		/>
	);
});
