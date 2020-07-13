import "./text.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Positions, Margins, getMarginTokens, getPositionToken} from "../design-system";

export type TextVariant =
	| "regular"
	| "bold"
	| "dimmed"
	| "semi-bold"
	| "light"
	| "monospaced"
	| "link"
	| "info";

type TextVariants = {
	variant?: TextVariant;
};

export type TextWrap = "normal" | "no";
export type TextWraps = {
	wrap?: TextWrap;
};

type TextOwnProps = JSX.IntrinsicElements["span"] & TextVariants & TextWraps & Margins & Positions;

export type TextProps<E extends React.ElementType> = PolymorphicComponentProps<E, TextOwnProps>;

const defaultElement = "span";

// prettier-ignore
export function Text<E extends React.ElementType = typeof defaultElement>({
	variant = "regular",
	wrap = "normal",
	m, mx, my, mt, mr, mb, ml,
	position = "static",
	...props
}: TextProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const positionToken = getPositionToken(position);

	return (
		<Box
			as={defaultElement}
			className="c-text"
			data-variant={variant}
			data-wrap={wrap}
			{...marginTokens}
			{...positionToken}
			{...props}
		/>
	);
}
