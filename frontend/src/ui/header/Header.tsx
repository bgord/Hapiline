import "./header.css";

import React from "react";

import {Margins, Paddings, getMarginTokens} from "../design-system";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";

type HeaderProps = JSX.IntrinsicElements["header"] & {
	variant?: HeaderVariant;
} & Margins &
	Paddings;

// prettier-ignore
export const Header: React.FC<HeaderProps> = ({
	variant = "medium",
	m, mx, my, mt, mr, mb, ml,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	...props
}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});

	return (
		<header
			data-p={p}
			data-px={px}
			data-py={py}
			data-pt={pt}
			data-pr={pr}
			data-pb={pb}
			data-pl={pl}
			data-variant={variant}
			className="c-header"
			{...marginTokens}
			{...props}
		/>
	);
};
