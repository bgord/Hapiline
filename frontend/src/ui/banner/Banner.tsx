import "./banner.css";

import React from "react";
import {
	Positions,
	Alignments,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getAlignmentTokens,
	getPositionToken,
} from "../design-system";

import {InfoIcon} from "../icons/Info";
import {ExclamationIcon} from "../icons/Exclamation";
import {CheckmarkIcon} from "../icons/Checkmark";
import * as UI from "../";

type BannerVariant = "info" | "error" | "success";
type BannerSize = "normal" | "big" | "small";

type BannerProps = JSX.IntrinsicElements["div"] & {variant: BannerVariant} & {
	size?: BannerSize;
} & Margins &
	Paddings &
	Alignments &
	Positions;

// prettier-ignore
export function Banner({
	variant,
	size = "normal",
	m, mx, my, mt, mr, mb, ml,
	p, px, py, pt, pr, pb, pl,
	mainAxis, crossAxis, crossAxisSelf,
	position = "static",
	...props
}: BannerProps) {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
	const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});
	const positionToken = getPositionToken(position);

	return (
		<div
			className="c-banner"
			data-variant={variant}
			data-size={size}
			{...marginTokens}
			{...paddingTokens}
			{...alignmentTokens}
			{...positionToken}
			{...props}
		/>
	);
}

type SpecificBannerProps = JSX.IntrinsicElements["div"] &
	Margins &
	Paddings & {
		size?: BannerSize;
	} & Alignments &
	Positions;

export function InfoBanner({children, ...props}: UI.WithChildren<SpecificBannerProps>) {
	return (
		<Banner {...props} variant="info">
			<InfoIcon />
			<UI.Text style={{fontSize: "14px"}} ml="12">
				{children}
			</UI.Text>
		</Banner>
	);
}

export function ErrorBanner({children, ...props}: UI.WithChildren<SpecificBannerProps>) {
	return (
		<Banner {...props} variant="error">
			<ExclamationIcon stroke="#682d36" />
			<UI.Text style={{fontSize: "14px", color: "#682d36"}} ml="12">
				{children}
			</UI.Text>
		</Banner>
	);
}

export function SuccessBanner({children, ...props}: UI.WithChildren<SpecificBannerProps>) {
	return (
		<Banner {...props} variant="success">
			<CheckmarkIcon />
			<UI.Text style={{fontSize: "14px", color: "#025D26"}} ml="12">
				{children}
			</UI.Text>
		</Banner>
	);
}
