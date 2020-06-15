import "./row.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {
	Widths,
	Positions,
	Borders,
	Alignments,
	Backgrounds,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getAlignmentTokens,
} from "../design-system";

type RowOwnProps = Margins & Alignments & Widths & Paddings & Positions & Backgrounds & Borders;

export type RowProps<E extends React.ElementType> = PolymorphicComponentProps<E, RowOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Row<E extends React.ElementType = typeof defaultElement>({
	width,
	bg,
	mainAxis = "start", crossAxis = "center", crossAxisSelf,
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
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
}: RowProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});

	return (
		<Box
			as={defaultElement}
			className="c-row"
			data-width={width}
			data-position={position}
			data-bg={bg}
			data-bw={bw}
			data-b={b}
			data-bx={bx}
			data-by={by}
			data-bt={bt}
			data-br={br}
			data-bb={bb}
			data-bl={bl}
			{...marginTokens}
			{...paddingTokens}
			{...alignmentTokens}
			{...props}
		/>
	);
}
