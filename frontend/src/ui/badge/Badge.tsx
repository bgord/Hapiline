import "./badge.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {Margins, Paddings} from "../design-system";

export type BadgeVariant = "positive" | "negative" | "neutral" | "light" | "normal" | "strong";

type BadgeOwnProps = JSX.IntrinsicElements["div"] & {variant: BadgeVariant} & Margins & Paddings;

export type BadgeProps<E extends React.ElementType> = PolymorphicComponentProps<E, BadgeOwnProps>;

const defaultElement = "div";

export function Badge<E extends React.ElementType = typeof defaultElement>({
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
}: BadgeProps<E>): JSX.Element {
	return (
		<Box
			as={defaultElement}
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
}
