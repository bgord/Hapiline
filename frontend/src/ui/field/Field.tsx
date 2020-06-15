import "./field.css";

import React from "react";

import {Widths, Margins, getMarginTokens} from "../design-system";

type FieldVariant = "column" | "row";

type FieldProps = JSX.IntrinsicElements["div"] &
	Margins &
	Widths & {
		children: JSX.IntrinsicElements["div"]["children"];
		variant?: FieldVariant;
	};

// prettier-ignore
export const Field: React.FC<FieldProps> = ({
	children,
	m, mx, my, mt, mr, mb, ml, 
  width,
	variant = "column",
	...props
}) => {
	const passedChildren = [...React.Children.toArray(children)];
	const reorderedChildren = passedChildren.reverse();

	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});

	return (
		<div data-width={width} data-variant={variant} className="c-field" {...marginTokens} {...props}>
			{reorderedChildren}
		</div>
	);
};
