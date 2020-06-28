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
	Wraps,
	ZIndexes,
	getMarginTokens,
	getPaddingTokens,
	getAlignmentTokens,
	getPositionToken,
	getWidthToken,
	getBackgroundToken,
	getBorderTokens,
	getWrapToken,
	getZIndexToken,
} from "../design-system";

type RowOwnProps = Margins &
	Alignments &
	Widths &
	Paddings &
	Positions &
	Backgrounds &
	Borders &
	Wraps &
	ZIndexes;

export type RowProps<E extends React.ElementType> = PolymorphicComponentProps<E, RowOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Row<E extends React.ElementType = typeof defaultElement>({
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	mainAxis = "start", crossAxis = "center", crossAxisSelf,
	position = "static",
	width,
	bg,
	b, bx, by, bt, br, bb, bl, bw,
	wrap,
	z,
	...props
}: RowProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});
	const positionToken = getPositionToken(position);
	const widthToken = getWidthToken(width);
	const backgroundToken = getBackgroundToken(bg);
	const borderTokens = getBorderTokens({b, bx, by, bt, br, bb, bl, bw});
	const wrapToken = getWrapToken(wrap);
	const zIndexToken = getZIndexToken(z);

	return (
		<Box
			as={defaultElement}
			className="c-row"
			{...marginTokens}
			{...paddingTokens}
			{...alignmentTokens}
			{...positionToken}
			{...widthToken}
			{...backgroundToken}
			{...borderTokens}
			{...wrapToken}
			{...zIndexToken}
			{...props}
		/>
	);
}
