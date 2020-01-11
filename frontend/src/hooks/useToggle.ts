import React from "react";

type useToggleType = [boolean, VoidFunction, VoidFunction, VoidFunction];

export const useToggle = (defaultValue = false): useToggleType => {
	const [isOn, setIsOn] = React.useState(defaultValue);

	const setOn = () => setIsOn(true);
	const setOff = () => setIsOn(false);
	const toggleIsOn = () => setIsOn(v => !v);

	return [isOn, setOn, setOff, toggleIsOn];
};
