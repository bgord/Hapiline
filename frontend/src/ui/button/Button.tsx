/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Positions} from "../positions";
import {Backgrounds} from "../backgrounds";

type ButtonVariants = "secondary" | "primary" | "outlined" | "bare" | "danger";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
	variant: ButtonVariants;
} & Margins &
	Paddings &
	Positions &
	Backgrounds;

/* eslint-disable prefer-arrow-callback */
export const Button = React.forwardRef(function _Button(
	{
		type = "button",
		position = "static",
		variant,
		bg,
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
	}: ButtonProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	return (
		<button
			ref={ref}
			type={type}
			data-variant={variant}
			data-position={position}
			data-bg={bg}
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
			className="c-button"
			{...props}
		/>
	);
});
