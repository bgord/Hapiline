import React from "react";

type useToggleType = {
	on: boolean;
	setOn: VoidFunction;
	setOff: VoidFunction;
	toggle: VoidFunction;
};

export const useToggle = (defaultValue = false): useToggleType => {
	const [on, setIsOn] = React.useState(defaultValue);

	const setOn = () => setIsOn(true);
	const setOff = () => setIsOn(false);
	const toggle = () => setIsOn(v => !v);

	return {on, setOn, setOff, toggle};
};
