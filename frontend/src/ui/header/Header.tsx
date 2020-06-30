import "./header.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Margins, Paddings, getMarginTokens, getPaddingTokens} from "../design-system";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";
type ResponsiveHeaderVariant = HeaderVariant | [HeaderVariant, HeaderVariant];

type HeaderVariants = {
	variant?: ResponsiveHeaderVariant;
};

type HeaderOwnProps = JSX.IntrinsicElements["header"] & HeaderVariants & Margins & Paddings;

export type HeaderProps<E extends React.ElementType> = PolymorphicComponentProps<E, HeaderOwnProps>;

const defaultElement = "h1";

// prettier-ignore
export function Header<E extends React.ElementType = typeof defaultElement>({
	variant = "medium",
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	...props
}: HeaderProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const variantTokens = getHeaderVariantTokens(variant);

	return (
		<Box
			as={defaultElement}
			className="c-header"
			{...variantTokens}
			{...marginTokens}
			{...paddingTokens}
			{...props}
		/>
	);
}

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
