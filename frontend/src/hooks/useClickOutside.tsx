import React from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement>, onClickOutside: VoidFunction) {
	React.useEffect(() => {
		if (!ref.current) return;

		function handleClickOutside(event: MouseEvent) {
			if (!ref.current?.contains(event.target as Node)) {
				onClickOutside();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClickOutside, ref]);
}
