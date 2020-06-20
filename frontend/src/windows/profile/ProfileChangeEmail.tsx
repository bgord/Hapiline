import React from "react";
import {useHistory} from "react-router-dom";
import {useMutation} from "react-query";

import {api} from "../../services/api";
import {getRequestStateErrors} from "../../selectors/getRequestErrors";
import {useDocumentTitle} from "../../hooks/useDocumentTitle";
import {useErrorToast} from "../../contexts/toasts-context";
import {useUserProfile} from "../../contexts/auth-context";
import * as UI from "../../ui";
import {NewEmailPayload} from "../../models";

export const ProfileChangeEmail: React.FC = () => {
	useDocumentTitle("Hapiline - profile");

	const history = useHistory();
	const triggerErrorToast = useErrorToast();
	const [userProfile] = useUserProfile();

	const initialEmail = userProfile?.email;
	const [newEmail, setNewEmail] = React.useState<NewEmailPayload["newEmail"]>("");
	const [password, setPassword] = React.useState<NewEmailPayload["password"]>("");

	const [changeEmail, changeEmailRequestState] = useMutation<unknown, NewEmailPayload>(
		api.auth.changeEmail,
		{
			onSuccess: () => {
				setTimeout(() => history.push("/logout"), 5000);
			},
			onError: () => triggerErrorToast("Couldn't change email."),
		},
	);

	const isNewEmailDifferent = newEmail !== "" && newEmail !== initialEmail;
	const {errorCode, getArgErrorMessage} = getRequestStateErrors(changeEmailRequestState);

	const passwordInlineError = errorCode === "E_ACCESS_DENIED" ? "Invalid password." : null;
	const emailInlineError = getArgErrorMessage("email");

	return (
		<UI.Column
			as="form"
			onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				changeEmail({newEmail, password});
			}}
			p="24"
			bw="2"
			bb="gray-2"
		>
			<UI.Header variant="extra-small" mt="12" mb="12">
				Email change
			</UI.Header>

			<UI.InfoBanner mt="12">
				You will have to confirm your new email adress and login back again.
			</UI.InfoBanner>

			<UI.ShowIf request={changeEmailRequestState} is={["idle", "loading", "error"]}>
				<UI.Field mt="24" mr="12" width="100%">
					<UI.Label htmlFor="new_email">New email</UI.Label>
					<UI.Input
						id="new_email"
						value={newEmail}
						onChange={event => setNewEmail(event.target.value)}
						required
						type="new_email"
						disabled={changeEmailRequestState.status === "loading"}
						placeholder="new@example.com"
					/>
					<UI.ShowIf request={changeEmailRequestState} is="error">
						{emailInlineError && <UI.Error>{emailInlineError}</UI.Error>}
					</UI.ShowIf>
				</UI.Field>

				<UI.Field mt="12">
					<UI.Label htmlFor="password">Password</UI.Label>
					<UI.Input
						id="password"
						pattern=".{6,}"
						title="Password should contain at least 6 characters."
						required
						value={password}
						onChange={event => setPassword(event.target.value)}
						type="password"
						placeholder="********"
						disabled={changeEmailRequestState.status === "loading"}
					/>
				</UI.Field>
			</UI.ShowIf>

			<UI.ShowIf request={changeEmailRequestState} is="error">
				{passwordInlineError && <UI.Error>{passwordInlineError}</UI.Error>}
			</UI.ShowIf>

			<UI.ShowIf request={changeEmailRequestState} is={["idle", "loading", "error"]}>
				<UI.Row mt="24">
					<UI.Button type="submit" variant="primary" disabled={!isNewEmailDifferent}>
						Confirm email
					</UI.Button>
				</UI.Row>
			</UI.ShowIf>

			<UI.ShowIf request={changeEmailRequestState} is="loading">
				<UI.Text mt="12">Email change pending...</UI.Text>
			</UI.ShowIf>

			<UI.ShowIf request={changeEmailRequestState} is="success">
				<UI.SuccessBanner crossAxisSelf="start" mt="24" size="big">
					<UI.Text ml="12">
						Email confirmation message has been sent!
						<br /> You will be logged out in 5 seconds.
					</UI.Text>
				</UI.SuccessBanner>
			</UI.ShowIf>
		</UI.Column>
	);
};
