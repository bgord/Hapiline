/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

type ButtonVariants = "normal" | "primary" | "outlined";

export const Button: React.FC<JSX.IntrinsicElements["button"] & {
	variant: ButtonVariants;
}> = ({type = "button", variant, ...props}) => (
	<button type={type} className={`c-button c-button--${variant}`} {...props} />
);
