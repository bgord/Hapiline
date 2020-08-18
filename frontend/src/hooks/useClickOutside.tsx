import React from "react";

export function useClickOutside(
	ref: React.RefObject<HTMLElement>,
	onClickOutside: VoidFunction,
	exclude?: React.RefObject<HTMLElement>[],
) {
	React.useEffect(() => {
		if (!ref.current) return;

		function handleClickOutside(event: MouseEvent) {
			if (!ref.current?.contains(event.target as Node)) {
				const isExcludedNodeClicked = exclude?.some(node =>
					node.current?.contains(event.target as Node),
				);

				if (!isExcludedNodeClicked) {
					onClickOutside();
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClickOutside, ref]);
}
