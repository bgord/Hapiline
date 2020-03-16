import "./text.css";

import React from "react";

import {Margins} from "../margins";
import {Positions} from "../positions";

export type TextVariant =
	| "regular"
	| "bold"
	| "dimmed"
	| "semi-bold"
	| "light"
	| "monospaced"
	| "link";

type TextProps = JSX.IntrinsicElements["div"] & {
	variant?: TextVariant;
} & Margins &
	Positions;

export const Text: React.FC<TextProps> = ({
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
}) => (
	<span
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
