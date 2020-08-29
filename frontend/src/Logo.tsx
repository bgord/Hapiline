import React from "react";

import {BREAKPOINTS} from "./ui/breakpoints";

export function Logo(props: JSX.IntrinsicElements["img"]) {
	const fullLogoFilename = "logo.png";
	const iconLogoFilename = "logo-icon.png";

	return (
		<img
			alt="Hapiline brand"
			src={fullLogoFilename}
			srcSet={`${fullLogoFilename} 181w, ${iconLogoFilename} 50w`}
			sizes={`(max-width: ${BREAKPOINTS.lg}px) 50px, 181px`}
			{...props}
		/>
	);
}
