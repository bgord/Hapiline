import "./header.css";

import React from "react";

import {Margins} from "../margins";
import {Paddings} from "../paddings";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";

type HeaderProps = JSX.IntrinsicElements["header"] & {
	variant?: HeaderVariant;
} & Margins &
	Paddings;

export const Header: React.FC<HeaderProps> = ({
	variant = "medium",
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	...props
}) => (
	<header
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		data-p={p}
		data-px={px}
		data-py={py}
		data-pt={pt}
		data-pr={pr}
		data-pb={pb}
		data-pl={pl}
		data-variant={variant}
		className="c-header"
		{...props}
	/>
);
