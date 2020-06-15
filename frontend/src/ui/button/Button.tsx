/* eslint-disable react/button-has-type */

import "./button.css";

import React from "react";

import {
	Positions,
	Backgrounds,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getPositionToken,
} from "../design-system";

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
		variant,
		layout,
		bg,
		m, mx, my, mt, mr, mb, ml,
		p, px, py, pt, pr, pb, pl,
		position = "static",
		...props
	}: ButtonProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const positionToken = getPositionToken({position});

	return (
		<button
			ref={ref}
			type={type}
			data-variant={variant}
			data-layout={layout}
			data-bg={bg}
			className="c-button"
			{...marginTokens}
			{...paddingTokens}
			{...positionToken}
			{...props}
		/>
	);
});
