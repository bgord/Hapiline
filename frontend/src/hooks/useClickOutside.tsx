import React from "react";

export function useClickOutside(
	ref: React.RefObject<HTMLElement>,
	onClickOutside: VoidFunction,
	exclude?: React.RefObject<HTMLElement>[],
) {
	React.useEffect(() => {
		if (!ref.current) return;

		function handleClickOutside(event: MouseEvent) {
			// Check if click event happened outside the `ref`
			// so the `onClickOutside` callback `may` be fired.
			if (!ref.current?.contains(event.target as Node)) {
				// The second check is to check if some `exclude`d node
				// outside the `ref` node has been clicked.
				const isExcludedNodeClicked = exclude?.some(node =>
					node.current?.contains(event.target as Node),
				);

				// `onClickOutside` callback is fired if the click event
				// happened outside both `ref` node and `exclude`d nodes.
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
