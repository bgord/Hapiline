import React from "react";

import {BREAKPOINTS} from "./ui/breakpoints";

export function Logo() {
	const fullLogoFilename = "logo.png";
	const iconLogoFilename = "logo-icon.png";

	return (
		<picture>
			<source srcSet={fullLogoFilename} media={`(min-width: ${BREAKPOINTS.lg}px)`} />
			<img src={iconLogoFilename} alt="Hapiline brand" />
		</picture>
	);
}
