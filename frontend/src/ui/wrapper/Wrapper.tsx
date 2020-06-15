import React from "react";

import {
	Widths,
	Alignments,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
} from "../design-system";

type WrapperProps = JSX.IntrinsicElements["div"] & Margins & Alignments & Widths & Paddings;

// prettier-ignore
export const Wrapper: React.FC<WrapperProps> = ({
	mainAxis = "start",
	crossAxis = "center",
	width,
	m, mx, my, mt, mr, mb, ml,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	...props
}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});

	return (
		<div
			data-main-axis={mainAxis}
			data-cross-axis={crossAxis}
			data-width={width}
			{...marginTokens}
			{...paddingTokens}
			{...props}
		/>
	);
};
