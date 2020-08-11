import React from "react";

import {BREAKPOINTS} from "./ui/breakpoints";

export function Logo(props: JSX.IntrinsicElements["img"]) {
	const fullLogo = "logo.png";
	const iconLogo = "logo-icon.png";

	return (
		<img
			alt="Hapiline brand"
			src={fullLogo}
			srcSet={`${fullLogo} 181w, ${iconLogo} 50w`}
			sizes={`(max-width: ${BREAKPOINTS.lg}px) 50px, 181px`}
			{...props}
		/>
	);
}
