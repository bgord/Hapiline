import "./field.css";

import React from "react";

type FieldVariant = "column" | "row";

export const Field: React.FC<JSX.IntrinsicElements["div"] & {
	children: JSX.IntrinsicElements["div"]["children"];
	variant: FieldVariant;
}> = ({variant, ...props}) => <div className={`c-field c-field--${variant}`} {...props} />;
