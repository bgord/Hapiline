import React from "react";
import {usePersistentState} from "./usePersistentState";

export const useToggle = (defaultValue = false) => {
	const [on, setIsOn] = React.useState(defaultValue);

	const setOn = () => setIsOn(true);
	const setOff = () => setIsOn(false);
	const toggle = () => setIsOn(v => !v);

	return {on, setOn, setOff, toggle};
};

export function usePersistentToggle(
	defaultValue: boolean,
	key: Parameters<typeof usePersistentState>[0],
): ReturnType<typeof useToggle> {
	const [persistentToggleValue, setPersistentToggleValue] = usePersistentState(key, defaultValue);

	const toggleState = useToggle(persistentToggleValue);

	React.useEffect(() => {
		setPersistentToggleValue(toggleState.on);
	}, [toggleState.on, setPersistentToggleValue]);

	return toggleState;
}
