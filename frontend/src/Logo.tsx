import React from "react";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

export function Logo(props: JSX.IntrinsicElements["img"]) {
	const mediaQuery = useMediaQuery();

	const src = mediaQuery === MEDIA_QUERY.default ? "logo.png" : "logo-icon.png";

	return (
		<img
			alt="Hapiline brand"
			src={src}
			style={{
				height: mediaQuery === MEDIA_QUERY.default ? "50px" : "45px",
				minWidth: mediaQuery === MEDIA_QUERY.default ? "180px" : "45px",
			}}
			{...props}
		/>
	);
}
