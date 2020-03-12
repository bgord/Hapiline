import "./text.css";

import React from "react";

import {Margins} from "../margins";

type TextVariant = "regular" | "bold" | "dimmed" | "semi-bold" | "light" | "monospaced" | "link";

export const Text: React.FC<JSX.IntrinsicElements["div"] &
	Margins & {
		variant?: TextVariant;
	}> = ({variant = "regular", m, mx, my, mt, mr, mb, ml, ...props}) => (
	<span
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		data-variant={variant}
		className="c-text"
		{...props}
	/>
);
