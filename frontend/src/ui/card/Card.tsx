import "./card.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {
	Positions,
	Backgrounds,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getPositionToken,
} from "../design-system";

type CardOwnProps = JSX.IntrinsicElements["div"] & Paddings & Margins & Positions & Backgrounds;

export type CardProps<E extends React.ElementType> = PolymorphicComponentProps<E, CardOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Card<E extends React.ElementType = typeof defaultElement>({
	bg,
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	position = "static",
	...props
}: CardProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const positionToken = getPositionToken({position});

	return (
		<Box
			as={defaultElement}
			className="c-card"
			data-bg={bg}
			{...marginTokens}
			{...paddingTokens}
			{...positionToken}
			{...props}
		/>
	);
}
