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
} from "../design-system";

type CardOwnProps = JSX.IntrinsicElements["div"] & Paddings & Margins & Positions & Backgrounds;

export type CardProps<E extends React.ElementType> = PolymorphicComponentProps<E, CardOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Card<E extends React.ElementType = typeof defaultElement>({
	p, px, py, pt, pr, pb, pl,
	m, mx, my, mt, mr, mb, ml,
	bg,
	position = "static",
	...props
}: CardProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});

	return (
		<Box
			as={defaultElement}
			data-p={p}
			data-px={px}
			data-py={py}
			data-pt={pt}
			data-pr={pr}
			data-pb={pb}
			data-pl={pl}
			data-bg={bg}
			data-position={position}
			className="c-card"
			{...marginTokens}
			{...paddingTokens}
			{...props}
		/>
	);
}
