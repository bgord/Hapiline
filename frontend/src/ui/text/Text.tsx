import "./text.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Positions, Margins, getMarginTokens} from "../design-system";

export type TextVariant =
	| "regular"
	| "bold"
	| "dimmed"
	| "semi-bold"
	| "light"
	| "monospaced"
	| "link";

type TextOwnProps = JSX.IntrinsicElements["span"] & {
	variant?: TextVariant;
} & Margins &
	Positions;

export type TextProps<E extends React.ElementType> = PolymorphicComponentProps<E, TextOwnProps>;

const defaultElement = "span";

// prettier-ignore
export function Text<E extends React.ElementType = typeof defaultElement>({
	variant = "regular",
	m, mx, my, mt, mr, mb, ml,
	position = "static",
	...props
}: TextProps<E>): JSX.Element {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});

	return (
		<Box
			as={defaultElement}
			data-variant={variant}
			data-position={position}
			className="c-text"
			{...marginTokens}
			{...props}
		/>
	);
}
