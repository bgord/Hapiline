import React from "react";

import {
	Widths,
	Alignments,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getAlignmentTokens,
	getWidthToken,
} from "../design-system";

import * as UI from "../";

type WrapperProps = JSX.IntrinsicElements["div"] & Margins & Alignments & Widths & Paddings;

// prettier-ignore
export function Wrapper({
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	mainAxis = "start", crossAxis = "center", crossAxisSelf,
	width,
	...props
}: UI.WithChildren<WrapperProps>)  {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});
	const widthToken = getWidthToken(width);

	return (
		<div
			{...marginTokens}
			{...paddingTokens}
			{...alignmentTokens}
			{...widthToken}
			{...props}
		/>
	);
}
