import "./text.css";

import React from "react";

import {Margins} from "../margins";

type TextVariant = "regular" | "bold" | "dimmed" | "semi-bold" | "light";

export const Text: React.FC<JSX.IntrinsicElements["div"] &
	Margins & {
		variant?: TextVariant;
	}> = ({variant = "regular", mt, mr, mb, ml, ...props}) => (
	<span
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className={`c-text c-text--${variant}`}
		{...props}
	/>
);
