import "./text.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Positions, Margins} from "../design-system";

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

export function Text<E extends React.ElementType = typeof defaultElement>({
	variant = "regular",
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	position = "static",
	...props
}: TextProps<E>): JSX.Element {
	return (
		<Box
			as={defaultElement}
			data-m={m}
			data-mx={mx}
			data-my={my}
			data-mt={mt}
			data-mr={mr}
			data-mb={mb}
			data-ml={ml}
			data-variant={variant}
			data-position={position}
			className="c-text"
			{...props}
		/>
	);
}
