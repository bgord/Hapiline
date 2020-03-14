import "./column.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Alignments} from "../alignments";
import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Widths} from "../widths";
import {Positions} from "../positions";
import {Backgrounds} from "../backgrounds";
import {Borders} from "../borders";

type ColumnOwnProps = Margins & Alignments & Paddings & Widths & Positions & Backgrounds & Borders;

export type ColumnProps<E extends React.ElementType> = PolymorphicComponentProps<E, ColumnOwnProps>;

const defaultElement = "div";

export const Column = React.forwardRef(
	<E extends React.ElementType = typeof defaultElement>(
		{
			ref,
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
			width,
			bg,
			position = "static",
			bw,
			b,
			bx,
			by,
			bt,
			br,
			bb,
			bl,
			...props
		}: ColumnProps<E>,
		innerRef: typeof ref,
	) => {
		return (
			<Box
				ref={innerRef}
				as={defaultElement}
				data-main-axis={mainAxis}
				data-cross-axis={crossAxis}
				data-width={width}
				data-position={position}
				data-bg={bg}
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
				data-bw={bw}
				data-b={b}
				data-bx={bx}
				data-by={by}
				data-bt={bt}
				data-br={br}
				data-bb={bb}
				data-bl={bl}
				className="c-column"
				{...props}
			/>
		);
	},
) as <E extends React.ElementType = typeof defaultElement>(props: ColumnProps<E>) => JSX.Element;
