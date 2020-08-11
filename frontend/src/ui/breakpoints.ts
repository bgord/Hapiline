import React from "react";

export enum MEDIA_QUERY {
	"default" = "default",
	"lg" = "lg",
}

export const BREAKPOINTS: {[key in Exclude<MEDIA_QUERY, "default">]: number} = {
	[MEDIA_QUERY.lg]: 768,
};

export function useWindowSize(): {
	width: typeof window.innerWidth;
	height: typeof window.innerHeight;
} {
	function getSize() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

	const [windowSize, setWindowSize] = React.useState(getSize);

	React.useEffect(() => {
		function handleResize() {
			setWindowSize(getSize());
		}

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount and unmount

	return windowSize;
}

export function useWindowWidth(): typeof window.innerWidth {
	const windowSize = useWindowSize();
	return windowSize.width;
}

export function useWindowHeight(): typeof window.innerHeight {
	const windowSize = useWindowSize();
	return windowSize.height;
}

export function useMediaQuery(): MEDIA_QUERY {
	const windowWidth = useWindowWidth();

	if (windowWidth <= BREAKPOINTS.lg) {
		return MEDIA_QUERY.lg;
	}

	return MEDIA_QUERY.default;
}
