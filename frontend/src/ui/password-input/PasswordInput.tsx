import "./toggle-password-button.css";

import React from "react";
import {useToggle} from "../../hooks/useToggle";
import * as UI from "../";
import {User} from "../../models";
import omit from "lodash.omit";

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

type TogglePasswordInputType = "text" | "password";

export function PasswordInput(props: JSX.IntrinsicElements["input"]) {
	const [togglePasswordButtonProps, togglePasswordInputProps] = useTogglePassword(
		props.value as string,
	);

	return (
		<UI.Row width="100%">
			<UI.Input
				required
				pattern=".{6,}"
				title="Password should contain at least 6 characters."
				placeholder="*********"
				data-width="100%"
				{...togglePasswordInputProps}
				{...omit(props, "ref")}
			/>
			<UI.Button
				variant="outlined"
				ml="6"
				style={{width: "70px"}}
				{...omit(togglePasswordButtonProps, "isPasswordVisible")}
			>
				{/* Applying data-state to UI.Wrapper instead of UI.Button */}
				{/* because of a bug with buttons with "display: grid" on iOS */}
				<UI.Wrapper data-state={togglePasswordButtonProps.isPasswordVisible ? "visible" : "hidden"}>
					<UI.Wrapper data-for-state="hidden">Show</UI.Wrapper>
					<UI.Wrapper data-for-state="visible">Hide</UI.Wrapper>
				</UI.Wrapper>
			</UI.Button>
		</UI.Row>
	);
}
