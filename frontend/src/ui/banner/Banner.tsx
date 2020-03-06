import "./banner.css";

import React from "react";
import {Margins} from "../margins";
import {Paddings} from "../paddings";

type BannerVariant = "info" | "error" | "success";

type BannerProps = JSX.IntrinsicElements["div"] & {variant: BannerVariant} & Margins & Paddings;

export const Banner: React.FC<BannerProps> = ({
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
		className="c-banner"
		{...props}
	/>
);
