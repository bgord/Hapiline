import React from "react";

import {
	Widths,
	Alignments,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getAlignmentTokens,
} from "../design-system";

type WrapperProps = JSX.IntrinsicElements["div"] & Margins & Alignments & Widths & Paddings;

// prettier-ignore
export const Wrapper: React.FC<WrapperProps> = ({
	width,
	mainAxis = "start", crossAxis = "center", crossAxisSelf,
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	...props
}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});

	return (
		<div
			data-width={width}
			{...marginTokens}
			{...paddingTokens}
			{...alignmentTokens}
			{...props}
		/>
	);
};
