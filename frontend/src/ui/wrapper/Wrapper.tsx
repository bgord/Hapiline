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

type WrapperProps = JSX.IntrinsicElements["div"] & Margins & Alignments & Widths & Paddings;

// prettier-ignore
export const Wrapper: React.FC<WrapperProps> = ({
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	mainAxis = "start", crossAxis = "center", crossAxisSelf,
	width,
	...props
}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});
	const widthToken = getWidthToken({width});

	return (
		<div
			{...marginTokens}
			{...paddingTokens}
			{...alignmentTokens}
			{...widthToken}
			{...props}
		/>
	);
};
