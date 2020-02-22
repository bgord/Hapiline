import "./field.css";

import React from "react";

type FieldVariant = "column" | "row";

type Margin = "12" | "24" | "48" | undefined;

export const Field: React.FC<JSX.IntrinsicElements["div"] & {
	children: JSX.IntrinsicElements["div"]["children"];
	variant?: FieldVariant;
	mt?: Margin;
	mr?: Margin;
	mb?: Margin;
	ml?: Margin;
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
