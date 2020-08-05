import React from "react";
import tinykeys from "tinykeys";

export interface KeyBindingMap {
	[keybinding: string]: (event: KeyboardEvent) => void;
}

export function useKeyboardShortcurts(config: KeyBindingMap) {
	React.useEffect(() => {
		const unsubscribeShortcuts = tinykeys(window, config);

		return () => {
			unsubscribeShortcuts();
		};
	}, [config]);
}
