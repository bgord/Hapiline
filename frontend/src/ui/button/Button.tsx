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
	getBackgroundToken,
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
		m, mx, my, mt, mr, mb, ml,
		p, px, py, pt, pr, pb, pl,
		position = "static",
		bg,
		...props
	}: ButtonProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const positionToken = getPositionToken(position);
	const backgroundToken = getBackgroundToken(bg);

	return (
		<button
			className="c-button"
			ref={ref}
			type={type}
			data-variant={variant}
			data-layout={layout}
			{...marginTokens}
			{...paddingTokens}
			{...positionToken}
			{...backgroundToken}
			{...props}
		/>
	);
});
