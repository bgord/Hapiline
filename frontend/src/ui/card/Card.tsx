import "./card.css";

import React from "react";

import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Positions} from "../positions";

type CardProps = JSX.IntrinsicElements["div"] & Paddings & Margins & Positions;

export const Card: React.FC<CardProps> = ({
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
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
	<div
		data-p={p}
		data-px={px}
		data-py={py}
		data-pt={pt}
		data-pr={pr}
		data-pb={pb}
		data-pl={pl}
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		data-position={position}
		className="c-card"
		{...props}
	/>
);
