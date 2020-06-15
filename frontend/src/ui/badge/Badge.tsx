import "./badge.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Margins, Paddings, getMarginTokens, getPaddingTokens} from "../design-system";

export type BadgeVariant = "positive" | "negative" | "neutral" | "light" | "normal" | "strong";

type BadgeOwnProps = JSX.IntrinsicElements["div"] & {variant: BadgeVariant} & Margins & Paddings;

export type BadgeProps<E extends React.ElementType> = PolymorphicComponentProps<E, BadgeOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Badge<E extends React.ElementType = typeof defaultElement>({
	variant,
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	...props
}: BadgeProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});

	return (
		<Box
			as={defaultElement}
			data-variant={variant}
			className="c-badge"
			{...marginTokens}
			{...paddingTokens}
			{...props}
		/>
	);
}
