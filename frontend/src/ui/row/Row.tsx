import "./row.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Alignments} from "../alignments";
import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Widths} from "../widths";

type RowOwnProps = Margins & Alignments & Widths & Paddings;

export type RowProps<E extends React.ElementType> = PolymorphicComponentProps<E, RowOwnProps>;

const defaultElement = "div";

export function Row<E extends React.ElementType = typeof defaultElement>({
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
}: RowProps<E>): JSX.Element {
	return (
		<Box
			as={defaultElement}
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
}
