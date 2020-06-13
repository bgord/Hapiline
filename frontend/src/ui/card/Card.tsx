import "./card.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Positions} from "../positions";
import {Backgrounds} from "../backgrounds";

type CardOwnProps = JSX.IntrinsicElements["div"] & Paddings & Margins & Positions & Backgrounds;

export type CardProps<E extends React.ElementType> = PolymorphicComponentProps<E, CardOwnProps>;

const defaultElement = "div";

export function Card<E extends React.ElementType = typeof defaultElement>({
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
	bg,
	position = "static",
	...props
}: CardProps<E>): JSX.Element {
	return (
		<Box
			as={defaultElement}
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
			data-bg={bg}
			data-position={position}
			className="c-card"
			{...props}
		/>
	);
}
