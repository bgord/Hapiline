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
	getPositionToken,
	getWidthToken,
	getBackgroundToken,
} from "../design-system";

type RowOwnProps = Margins & Alignments & Widths & Paddings & Positions & Backgrounds & Borders;

export type RowProps<E extends React.ElementType> = PolymorphicComponentProps<E, RowOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Row<E extends React.ElementType = typeof defaultElement>({
	bw,
	b,
	bx,
	by,
	bt,
	br,
	bb,
	bl,
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	mainAxis = "start", crossAxis = "center", crossAxisSelf,
	position = "static",
	width,
	bg,
	...props
}: RowProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});
	const positionToken = getPositionToken({position});
	const widthToken = getWidthToken({width});
	const backgroundToken = getBackgroundToken({bg})

	return (
		<Box
			as={defaultElement}
			className="c-row"
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
			{...positionToken}
			{...widthToken}
			{...backgroundToken}
			{...props}
		/>
	);
}
