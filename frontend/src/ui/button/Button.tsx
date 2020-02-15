/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

type ButtonVariants = "normal" | "secondary" | "outlined";

export const Button: React.FC<JSX.IntrinsicElements["button"] & {
	variant: ButtonVariants;
}> = ({variant = "normal", type = "button", ...props}) => (
	<button type={type} className={`c-button c-button--${variant}`} {...props} />
);
