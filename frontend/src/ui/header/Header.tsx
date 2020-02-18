import "./header.css";

import React from "react";

type HeaderVariant = "extra-small" | "small" | "medium" | "large";

export const Header: React.FC<JSX.IntrinsicElements["header"] & {
	variant?: HeaderVariant;
}> = ({variant = "medium", ...props}) => (
	<header className={`c-header c-header--${variant}`} {...props} />
);
