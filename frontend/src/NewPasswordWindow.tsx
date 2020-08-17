import {useParams, Link} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {NewPasswordPayload} from "./models";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";

export const NewPasswordWindow: React.FC = () => {
	const {token} = useParams();
	const [password, setPassword] = React.useState("");
	const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

	const [togglePasswordButtonProps, togglePasswordInputProps] = UI.useTogglePassword(password);
	const [
		togglePasswordConfirmationButtonProps,
		togglePasswordConfirmationInputProps,
	] = UI.useTogglePassword(passwordConfirmation);

	const [setNewPassword, newPasswordRequestState] = useMutation<unknown, NewPasswordPayload>(
		api.auth.newPassword,
	);

	const {errorMessage} = getRequestStateErrors(newPasswordRequestState);

	return (
		<UI.Card py="48" px="24" mx={["auto", "12"]} my="72" width={["view-m", "auto"]}>
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					setNewPassword({
						token: decodeURIComponent(token ?? ""),
						password,
						password_confirmation: passwordConfirmation,
					});
				}}
			>
				<UI.Header>New password</UI.Header>

				<UI.Field mt="48">
					<UI.Label htmlFor="password">Password</UI.Label>
					<UI.Row width="100%">
						<UI.Input
							id="password"
							placeholder="********"
							autoComplete="new-password"
							title="Password should contain at least 6 characters."
							value={password}
							onChange={event => setPassword(event.target.value)}
							required
							pattern=".{6,}"
							disabled={newPasswordRequestState.status === "success"}
							data-width="100%"
							{...togglePasswordInputProps}
						/>
						<UI.TogglePasswordButton {...togglePasswordButtonProps} />
					</UI.Row>
				</UI.Field>

				<UI.Field mt="12">
					<UI.Label htmlFor="password_confirmation">Repeat password</UI.Label>
					<UI.Row width="100%">
						<UI.Input
							id="password_confirmation"
							placeholder="********"
							pattern={password}
							title="Passwords have to be equal"
							value={passwordConfirmation}
							onChange={event => setPasswordConfirmation(event.target.value)}
							required
							disabled={newPasswordRequestState.status === "success"}
							data-width="100%"
							{...togglePasswordConfirmationInputProps}
						/>
						<UI.TogglePasswordButton {...togglePasswordConfirmationButtonProps} />
					</UI.Row>
				</UI.Field>

				<UI.Row mainAxis="end" mt="24">
					<UI.Button
						variant="primary"
						type="submit"
						disabled={newPasswordRequestState.status === "success"}
						data-testid="registration-submit"
					>
						{newPasswordRequestState.status === "loading" ? "Loading..." : "Change password"}
					</UI.Button>
				</UI.Row>

				<UI.ShowIf request={newPasswordRequestState} is="success">
					<UI.SuccessBanner mt="48" size="big">
						<UI.Column ml="12">
							<UI.Text>Password has been changed!</UI.Text>
							<UI.Row mt="6">
								<UI.Text>You can</UI.Text>
								<UI.Text ml="6" variant="link" as={Link} to="/login">
									login now
								</UI.Text>
							</UI.Row>
						</UI.Column>
					</UI.SuccessBanner>
				</UI.ShowIf>

				<UI.ShowIf request={newPasswordRequestState} is="error">
					<UI.ErrorBanner mt="24">{errorMessage}</UI.ErrorBanner>
				</UI.ShowIf>
			</UI.Column>
		</UI.Card>
	);
};
