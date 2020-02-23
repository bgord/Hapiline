import "./field.css";

import React from "react";

import {Margins} from "../margins";
import {Widths} from "../widths";

type FieldVariant = "column" | "row";

type FieldProps = JSX.IntrinsicElements["div"] &
	Margins &
	Widths & {
		children: JSX.IntrinsicElements["div"]["children"];
		variant?: FieldVariant;
	};

export const Field: React.FC<FieldProps> = ({
	children,
	mt,
	mr,
	mb,
	ml,
	width,
	variant = "column",
	...props
}) => {
	const passedChildren = [...React.Children.toArray(children)];
	const reorderedChildren = passedChildren.reverse();

	return (
		<div
			data-width={width}
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
