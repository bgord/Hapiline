/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

import {Margins} from "../margins";
import {Paddings} from "../paddings";

type ButtonVariants = "secondary" | "primary" | "outlined" | "bare" | "danger";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
	Margins &
	Paddings & {
		variant: ButtonVariants;
	};

/* eslint-disable prefer-arrow-callback */
export const Button = React.forwardRef(function _Button(
	{
		type = "button",
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
	}: ButtonProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	return (
		<button
			ref={ref}
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
			type={type}
			data-variant={variant}
			className="c-button"
			{...props}
		/>
	);
});
