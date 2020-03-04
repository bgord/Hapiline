import "./banner.css";

import React from "react";

type BannerVariant = "info" | "error";

export const Banner: React.FC<JSX.IntrinsicElements["div"] & {variant: BannerVariant}> = ({
	variant,
	...props
}) => <div className={`c-banner c-banner--${variant}`} {...props} />;
