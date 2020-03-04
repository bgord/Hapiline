import "./error.css";

import React from "react";
import {Margins} from "../margins";

export const Error: React.FC<JSX.IntrinsicElements["div"] & Margins> = ({
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	...props
}) => (
	<div
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className="c-text c-error"
		{...props}
	/>
);
