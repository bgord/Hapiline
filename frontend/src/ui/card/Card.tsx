import "./card.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {
	Positions,
	Backgrounds,
	Margins,
	Paddings,
	Widths,
	ZIndexes,
	getMarginTokens,
	getPaddingTokens,
	getPositionToken,
	getBackgroundToken,
	getWidthToken,
	getZIndexToken,
} from "../design-system";

type CardOwnProps = JSX.IntrinsicElements["div"] &
	Paddings &
	Margins &
	Positions &
	Backgrounds &
	Widths &
	ZIndexes;

export type CardProps<E extends React.ElementType> = PolymorphicComponentProps<E, CardOwnProps>;

const defaultElement = "div";

// prettier-ignore
export function Card<E extends React.ElementType = typeof defaultElement>({
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	position = "static",
	bg,
	width,
	z,
	...props
}: CardProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const positionToken = getPositionToken(position);
	const backgroundToken = getBackgroundToken(bg);
	const widthToken = getWidthToken(width);
	const zIndexToken = getZIndexToken(z);

	return (
		<Box
			as={defaultElement}
			className="c-card"
			{...marginTokens}
			{...paddingTokens}
			{...positionToken}
			{...backgroundToken}
			{...widthToken}
			{...zIndexToken}
			{...props}
		/>
	);
}
