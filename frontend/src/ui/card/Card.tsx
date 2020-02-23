import "./card.css";

import React from "react";

import {Margins} from "../margins";
import {Paddings} from "../paddings";

export const Card: React.FC<JSX.IntrinsicElements["div"] & Paddings & Margins> = ({
	pt,
	pr,
	pb,
	pl,
	mt,
	mr,
	mb,
	ml,
	...props
}) => (
	<div
		data-pt={pt}
		data-pr={pr}
		data-pb={pb}
		data-pl={pl}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		className="c-card"
		{...props}
	/>
);
