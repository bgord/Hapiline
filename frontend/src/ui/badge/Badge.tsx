import "./badge.css";

import React from "react";
import {Margins} from "../margins";
import {Paddings} from "../paddings";

export type BadgeVariant = "positive" | "negative" | "neutral" | "light" | "normal" | "strong";

type BadgeProps = JSX.IntrinsicElements["div"] & {variant: BadgeVariant} & Margins & Paddings;

export const Badge: React.FC<BadgeProps> = ({
	variant,
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
	<div
		data-variant={variant}
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
		className="c-badge"
		{...props}
	/>
);
