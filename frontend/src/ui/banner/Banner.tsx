import "./banner.css";

import React from "react";

type BannerVariant = "info" | "error";

export const Banner: React.FC<JSX.IntrinsicElements["div"] & {variant: BannerVariant}> = ({
	variant,
	...props
}) => <div data-variant={variant} className="c-banner" {...props} />;
