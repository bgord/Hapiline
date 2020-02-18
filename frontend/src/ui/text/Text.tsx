import "./text.css";

import React from "react";

type TextVariant = "regular" | "bold";

export const Text: React.FC<JSX.IntrinsicElements["div"] & {
	variant?: TextVariant;
}> = ({variant = "regular", ...props}) => (
	<span className={`c-text c-text--${variant}`} {...props} />
);
