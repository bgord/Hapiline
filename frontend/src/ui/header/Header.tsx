import "./header.css";

import React from "react";

import {Margins, Paddings, getMarginTokens, getPaddingTokens} from "../design-system";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";
type ResponsiveHeaderVariant = HeaderVariant | [HeaderVariant, HeaderVariant];

type HeaderVariants = {
	variant?: ResponsiveHeaderVariant;
};

type HeaderProps = JSX.IntrinsicElements["header"] & HeaderVariants & Margins & Paddings;

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
  const variantTokens = getHeaderVariantTokens(variant)

	return (
		<header
			className="c-header"
      {...variantTokens}
			{...marginTokens}
			{...paddingTokens}
			{...props}
		/>
	);
};

function getHeaderVariantTokens(variant: ResponsiveHeaderVariant) {
	if (Array.isArray(variant)) {
		return {
			"data-variant": variant[0],
			"data-lg-variant": variant[1],
		};
	}

	return {
		"data-variant": variant,
	};
}
