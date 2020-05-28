import {useParams, Link} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {NewPasswordPayload} from "./interfaces/index";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";

export const NewPasswordWindow: React.FC = () => {
	const {token} = useParams();
	const [password, setPassword] = React.useState("");
	const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

	const [setNewPassword, newPasswordRequestState] = useMutation<unknown, NewPasswordPayload>(
		api.auth.newPassword,
	);

	const {errorMessage} = getRequestStateErrors(newPasswordRequestState);

	return (
		<UI.Card py="48" px="24" mx="auto" mt="72">
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					setNewPassword({token: token ?? "", password, passwordConfirmation});
				}}
			>
				<UI.Header>New password</UI.Header>

				<UI.Field mt="48">
					<UI.Label htmlFor="password">Password</UI.Label>
					<UI.Input
						id="password"
						placeholder="********"
						autoComplete="new-password"
						title="Password should contain at least 6 characters."
						value={password}
						onChange={event => setPassword(event.target.value)}
						type="password"
						required
						pattern=".{6,}"
						disabled={newPasswordRequestState.status === "success"}
						style={{width: "500px"}}
					/>
				</UI.Field>

				<UI.Field mt="12">
					<UI.Label htmlFor="password_confirmation">Repeat password</UI.Label>
					<UI.Input
						id="password_confirmation"
						type="password"
						placeholder="********"
						pattern={password}
						title="Passwords have to be equal"
						value={passwordConfirmation}
						onChange={event => setPasswordConfirmation(event.target.value)}
						required
						disabled={newPasswordRequestState.status === "success"}
					/>
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
					<UI.SuccessBanner mt="24" size="big">
						<UI.Column ml="12">
							<UI.Text>Password has been changed!</UI.Text>
							<UI.Row>
								<UI.Text>You can</UI.Text>
								<Link data-ml="6" data-variant="link" className="c-text" to="/login">
									login now
								</Link>
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
