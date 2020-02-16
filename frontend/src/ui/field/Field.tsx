import "./field.css";

import React from "react";

type FieldVariant = "column" | "row";

export const Field: React.FC<JSX.IntrinsicElements["div"] & {
	children: JSX.IntrinsicElements["div"]["children"];
	variant: FieldVariant;
}> = ({variant, children, ...props}) => {
	const passedChildren = [...React.Children.toArray(children)];
	const reorderedChildren = passedChildren.reverse();

	return (
		<div className={`c-field c-field--${variant}`} {...props}>
			{reorderedChildren}
		</div>
	);
};
