import React from "react";
import {useToggle} from "../hooks/useToggle";
import * as UI from "./";
import {User} from "../models";

export function useTogglePassword(
	password: User["password"],
): [
	{
		isPasswordVisible: ReturnType<typeof useToggle>["on"];
		onClick: JSX.IntrinsicElements["button"]["onClick"];
		disabled: JSX.IntrinsicElements["button"]["disabled"];
	},
	{type: TogglePasswordInputType},
] {
	const {on: isPasswordVisible, toggle: togglePasswordVisible, setOff: hidePassword} = useToggle();

	React.useEffect(() => {
		if (password.length === 0) {
			hidePassword();
		}
	}, [password, hidePassword]);

	const togglePasswordButtonProps = {
		isPasswordVisible,
		onClick: togglePasswordVisible,
		disabled: password.length === 0,
	};

	const togglePasswordInputProps: {type: TogglePasswordInputType} = {
		type: isPasswordVisible ? "text" : "password",
	};

	return [togglePasswordButtonProps, togglePasswordInputProps];
}

export function TogglePasswordButton(
	props: {isPasswordVisible: ReturnType<typeof useToggle>["on"]} & JSX.IntrinsicElements["button"],
) {
	const {isPasswordVisible, ref, ...rest} = props;

	return (
		<UI.Button ml="3" variant="bare" data-bg="gray-1" style={{width: "70px"}} {...rest}>
			{isPasswordVisible ? "Hide" : "Show"}
		</UI.Button>
	);
}

type TogglePasswordInputType = "text" | "password";
