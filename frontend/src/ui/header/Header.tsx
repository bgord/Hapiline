import "./header.css";

import React from "react";

import {Margins} from "../margins";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";

export const Header: React.FC<JSX.IntrinsicElements["header"] &
	Margins & {
		variant?: HeaderVariant;
	}> = ({variant = "medium", mt, mr, mb, ml, ...props}) => (
	<header
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className={`c-header c-header--${variant}`}
		{...props}
	/>
);
