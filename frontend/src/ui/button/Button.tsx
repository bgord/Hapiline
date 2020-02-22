/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

import {Margins} from "../margins";

type ButtonVariants = "secondary" | "primary" | "outlined";

export const Button: React.FC<JSX.IntrinsicElements["button"] &
	Margins & {
		variant: ButtonVariants;
	}> = ({type = "button", variant, mt, mr, mb, ml, ...props}) => (
	<button
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		type={type}
		className={`c-button c-button--${variant}`}
		{...props}
	/>
);
