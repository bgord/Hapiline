import React from "react";
import {useMutation} from "react-query";

import {api} from "../../services/api";
import {getRequestStateErrors} from "../../selectors/getRequestErrors";
import {useErrorToast} from "../../contexts/toasts-context";
import * as UI from "../../ui";
import {UpdatePasswordPayload} from "../../models";

export const ProfileChangePassword = () => {
	const triggerErrorToast = useErrorToast();

	const [oldPassword, setOldPassword] = React.useState<UpdatePasswordPayload["old_password"]>("");
	const [newPassword, setNewPassword] = React.useState<UpdatePasswordPayload["password"]>("");
	const [newPasswordConfirmation, setNewPasswordConfirmation] = React.useState<
		UpdatePasswordPayload["password_confirmation"]
	>("");

	const [updatePassword, updatePasswordRequestState] = useMutation<unknown, UpdatePasswordPayload>(
		api.auth.updatePassword,
		{
			onError: () => triggerErrorToast("Couldn't update password."),
		},
	);

	const {getArgErrorMessage, errorCode} = getRequestStateErrors(updatePasswordRequestState);

	const oldPasswordInlineError = getArgErrorMessage("old_password");

	const internalServerError =
		errorCode === "E_INTERNAL_SERVER_ERROR"
			? "An unexpected error happened, please try again."
			: null;

	return (
		<UI.Column
			as="form"
			onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				updatePassword({
					old_password: oldPassword,
					password: newPassword,
					password_confirmation: newPasswordConfirmation,
				});
			}}
			p="24"
			bw="2"
			bb="gray-2"
		>
			<UI.Header mt="12" mb="24" variant="extra-small">
				Password change
			</UI.Header>

			<UI.InfoBanner mb="24">
				You won't be logged out, remember to input the new password the next time.
			</UI.InfoBanner>

			<UI.ShowIf request={updatePasswordRequestState} is={["idle", "loading", "error"]}>
				<UI.Field mb="12">
					<UI.Label htmlFor="old_password">Old password</UI.Label>
					<UI.PasswordInput
						id="old_password"
						value={oldPassword}
						onChange={event => setOldPassword(event.target.value)}
						disabled={updatePasswordRequestState.status === "loading"}
					/>

					<UI.ShowIf request={updatePasswordRequestState} is="error">
						{oldPasswordInlineError && <UI.Error>{oldPasswordInlineError}</UI.Error>}
					</UI.ShowIf>
				</UI.Field>

				<UI.Field mb="12">
					<UI.Label htmlFor="new_password">New password</UI.Label>
					<UI.PasswordInput
						id="new_password"
						value={newPassword}
						onChange={event => setNewPassword(event.target.value)}
						disabled={updatePasswordRequestState.status === "loading"}
					/>
				</UI.Field>

				<UI.Field mb="24">
					<UI.Label htmlFor="password_confirmation">Repeat new password</UI.Label>
					<UI.PasswordInput
						id="password_confirmation"
						value={newPasswordConfirmation}
						onChange={event => setNewPasswordConfirmation(event.target.value)}
						disabled={updatePasswordRequestState.status === "loading"}
						pattern={newPassword}
						title="Passwords have to be equal"
					/>
				</UI.Field>

				<UI.Row>
					<UI.Button variant="primary" type="submit">
						Update password
					</UI.Button>
				</UI.Row>
			</UI.ShowIf>

			<UI.ShowIf request={updatePasswordRequestState} is="error">
				{internalServerError && <UI.Error>{internalServerError}</UI.Error>}
			</UI.ShowIf>

			<UI.ShowIf request={updatePasswordRequestState} is="success">
				<UI.SuccessBanner crossAxisSelf="start" size="big" mt="24">
					<UI.Text ml="6">Password changed successfully!</UI.Text>
				</UI.SuccessBanner>
			</UI.ShowIf>
		</UI.Column>
	);
};
