import "./banner.css";

import React from "react";

type BannerVariant = "info";

export const Banner: React.FC<JSX.IntrinsicElements["div"] & {variant: BannerVariant}> = ({
	variant,
	...props
}) => <div className={`c-banner c-banner--${variant}`} {...props} />;
