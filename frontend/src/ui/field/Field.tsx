import "./field.css";

import React from "react";

import {Widths, Margins, getMarginTokens, getWidthToken} from "../design-system";

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
	variant = "column",
	m, mx, my, mt, mr, mb, ml, 
  width,
	...props
}) => {
	const passedChildren = [...React.Children.toArray(children)];
	const reorderedChildren = passedChildren.reverse();

	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const widthToken = getWidthToken(width);

	return (
		<div data-variant={variant} className="c-field" {...marginTokens} {...widthToken} {...props}>
			{reorderedChildren}
		</div>
	);
};
