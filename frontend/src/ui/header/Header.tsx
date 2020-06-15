import "./header.css";

import React from "react";

import {Margins, Paddings, getMarginTokens, getPaddingTokens} from "../design-system";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";

type HeaderProps = JSX.IntrinsicElements["header"] & {
	variant?: HeaderVariant;
} & Margins &
	Paddings;

// prettier-ignore
export const Header: React.FC<HeaderProps> = ({
	variant = "medium",
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
		<header
			data-variant={variant}
			className="c-header"
			{...marginTokens}
			{...paddingTokens}
			{...props}
		/>
	);
};
