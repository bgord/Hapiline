/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

import {Positions, Backgrounds, Margins, Paddings, getMarginTokens} from "../design-system";

type ButtonVariant = "secondary" | "primary" | "outlined" | "bare" | "danger";
type ButtonLayout = "with-icon";

type ButtonVariants = {
	variant: ButtonVariant;
};

type ButtonLayouts = {
	layout?: ButtonLayout;
};

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
	ButtonVariants &
	ButtonLayouts &
	Margins &
	Paddings &
	Positions &
	Backgrounds;

// prettier-ignore
/* eslint-disable prefer-arrow-callback */
export const Button = React.forwardRef(function _Button(
	{
		type = "button",
		position = "static",
		variant,
		layout,
		bg,
		m, mx, my, mt, mr, mb, ml,
		p,
		px,
		py,
		pt,
		pr,
		pb,
		pl,
		...props
	}: ButtonProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});

	return (
		<button
			ref={ref}
			type={type}
			data-variant={variant}
			data-position={position}
			data-layout={layout}
			data-bg={bg}
			data-p={p}
			data-px={px}
			data-py={py}
			data-pt={pt}
			data-pr={pr}
			data-pb={pb}
			data-pl={pl}
			className="c-button"
			{...marginTokens}
			{...props}
		/>
	);
});
