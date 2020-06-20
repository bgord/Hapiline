import React from "react";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

// TODO: Refactor to the native `srcSet` and `sizes`
export const Logo: React.FC<JSX.IntrinsicElements["img"]> = props => {
	const mediaQuery = useMediaQuery();

	const src = mediaQuery === MEDIA_QUERY.default ? "logo.png" : "logo-icon.png";

	return (
		<img
			alt="Hapiline logo"
			src={src}
			style={{
				height: mediaQuery === MEDIA_QUERY.default ? "50px" : "45px",
				minWidth: mediaQuery === MEDIA_QUERY.default ? "180px" : "45px",
			}}
			{...props}
		/>
	);
};
