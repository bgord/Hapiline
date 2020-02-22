import "./field.css";

import React from "react";

import {Margins} from "../margins";

type FieldVariant = "column" | "row";

export const Field: React.FC<JSX.IntrinsicElements["div"] &
	Margins & {
		children: JSX.IntrinsicElements["div"]["children"];
		variant?: FieldVariant;
	}> = ({children, mt, mr, mb, ml, variant = "column", ...props}) => {
	const passedChildren = [...React.Children.toArray(children)];
	const reorderedChildren = passedChildren.reverse();

	return (
		<div
			data-mt={mt}
			data-mr={mr}
			data-mb={mb}
			data-ml={ml}
			className={`c-field c-field--${variant}`}
			{...props}
		>
			{reorderedChildren}
		</div>
	);
};
