import React from "react";

export function useBodyScrollLock(condition = true) {
	React.useLayoutEffect(() => {
		if (!condition) return;

		// Get original body overflow
		const originalStyle = window.getComputedStyle(document.body).overflow;

		// Prevent scrolling on mount
		document.body.style.overflow = "hidden";

		// Re-enable scrolling when component unmounts
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, [condition]);
}