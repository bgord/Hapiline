import "./banner.css";

import React from "react";
import {Margins} from "../margins";
import {Paddings} from "../paddings";
import {Alignments} from "../alignments";
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
	Alignments;

export const Banner: React.FC<BannerProps> = ({
	variant,
	size = "normal",
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	crossAxisSelf,
	...props
}) => (
	<div
		data-variant={variant}
		data-size={size}
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		data-p={p}
		data-px={px}
		data-py={py}
		data-pt={pt}
		data-pr={pr}
		data-pb={pb}
		data-pl={pl}
		data-cross-axis-self={crossAxisSelf}
		className="c-banner"
		{...props}
	/>
);

type SpecificBannerProps = JSX.IntrinsicElements["div"] &
	Margins &
	Paddings & {
		size?: BannerSize;
	} & Alignments;

export const InfoBanner: React.FC<SpecificBannerProps> = ({children, ...props}) => (
	<Banner {...props} variant="info">
		<InfoIcon />
		<UI.Text style={{fontSize: "14px"}} ml="12">
			{children}
		</UI.Text>
	</Banner>
);

export const ErrorBanner: React.FC<SpecificBannerProps> = ({children, ...props}) => (
	<Banner {...props} variant="error">
		<ExclamationIcon stroke="#682d36" />
		<UI.Text style={{color: "#682d36"}} ml="12">
			{children}
		</UI.Text>
	</Banner>
);

export const SuccessBanner: React.FC<SpecificBannerProps> = ({children, ...props}) => (
	<Banner {...props} variant="success">
		<CheckmarkIcon />
		<UI.Text style={{color: "#025D26"}}>{children}</UI.Text>
	</Banner>
);
