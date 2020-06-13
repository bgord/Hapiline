import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorToast} from "./contexts/toasts-context";
import {useUserProfile} from "./contexts/auth-context";
import * as UI from "./ui";
import {NewEmailPayload, UpdatePasswordPayload} from "./models";
import {formatTime} from "./config/DATE_FORMATS";

export const ProfileWindow = () => {
	const [profile] = useUserProfile();

	return (
		<UI.Column ml="auto" mr="auto" my="48" style={{maxWidth: "var(--view-width)"}}>
			<UI.Card>
				<UI.Row bg="gray-1" mt="12" p="24">
					<UI.Header variant="large">Profile settings</UI.Header>
				</UI.Row>
				<ChangeEmail />
				<ChangePassword />
				<DeleteAccount />
				<UI.Row mainAxis="end" p="12" mt="12">
					<UI.Text variant="dimmed">Created at:</UI.Text>
					<UI.Text variant="monospaced" ml="6">
						{profile?.created_at && formatTime(profile.created_at)}
					</UI.Text>
				</UI.Row>
			</UI.Card>
		</UI.Column>
	);
};

const ChangeEmail: React.FC = () => {
	useDocumentTitle("Hapiline - profile");

	const history = useHistory();
	const triggerErrorToast = useErrorToast();
	const [userProfile] = useUserProfile();

	const initialEmail = userProfile?.email;
	const [newEmail, setNewEmail] = React.useState<NewEmailPayload["newEmail"]>(initialEmail ?? "");
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
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input
						id="email"
						value={newEmail}
						onChange={event => setNewEmail(event.target.value)}
						required
						type="email"
						disabled={changeEmailRequestState.status === "loading"}
						placeholder="user@example.com"
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

const ChangePassword = () => {
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
					<UI.Input
						id="old_password"
						placeholder="********"
						title="Password should contain at least 6 characters."
						value={oldPassword}
						onChange={event => setOldPassword(event.target.value)}
						type="password"
						required
						pattern=".{6,}"
						disabled={updatePasswordRequestState.status === "loading"}
					/>
					<UI.ShowIf request={updatePasswordRequestState} is="error">
						oldPasswordInlineError && (<UI.Error>{oldPasswordInlineError}</UI.Error>)
					</UI.ShowIf>
				</UI.Field>

				<UI.Field mb="12">
					<UI.Label htmlFor="new_password">New password</UI.Label>
					<UI.Input
						id="new_password"
						placeholder="********"
						title="Password should contain at least 6 characters."
						value={newPassword}
						onChange={event => setNewPassword(event.target.value)}
						type="password"
						required
						pattern=".{6,}"
						disabled={updatePasswordRequestState.status === "loading"}
					/>
				</UI.Field>

				<UI.Field mb="24">
					<UI.Label htmlFor="password_confirmation">Repeat new password</UI.Label>
					<UI.Input
						id="password_confirmation"
						type="password"
						placeholder="********"
						pattern={newPassword}
						title="Passwords have to be equal"
						value={newPasswordConfirmation}
						onChange={event => setNewPasswordConfirmation(event.target.value)}
						required
						disabled={updatePasswordRequestState.status === "loading"}
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

const DeleteAccount = () => {
	const [modalStatus, setModalStatus] = React.useState<"idle" | "editing">("idle");

	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerErrorToast = useErrorToast();
	const history = useHistory();

	const [deleteAccount, deleteAccountRequestState] = useMutation(api.auth.deleteAccount, {
		onSuccess: () => history.push("/logout"),
		onError: () => triggerErrorToast("Couldn't delete account."),
	});

	function confirmDeletion() {
		setModalStatus("idle");
		deleteAccount();
	}
	return (
		<UI.Column p="24">
			<UI.Header mt="12" variant="extra-small">
				Account deletion
			</UI.Header>

			<UI.ErrorBanner mt="24">
				Your data will be removed pernamently, and you won't be able to recover your account.
			</UI.ErrorBanner>

			<UI.Button
				mt="24"
				variant="danger"
				disabled={deleteAccountRequestState.status === "loading"}
				onClick={() => setModalStatus("editing")}
				mr="auto"
			>
				Delete account
			</UI.Button>

			<UI.ShowIf request={deleteAccountRequestState} is="error">
				<UI.Error mt="12">An error occurred during account deletion.</UI.Error>
			</UI.ShowIf>

			{modalStatus === "editing" && (
				<AlertDialog leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}>
					<AlertDialogLabel>
						<UI.Header variant="small">Do you really want to delete your account?</UI.Header>
					</AlertDialogLabel>
					<UI.Row mt="48" mainAxis="between">
						<UI.Button variant="danger" onClick={confirmDeletion}>
							Yes, delete
						</UI.Button>
						<UI.Button
							variant="primary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={() => setModalStatus("idle")}
						>
							Nevermind, don't delete
						</UI.Button>
					</UI.Row>
				</AlertDialog>
			)}
		</UI.Column>
	);
};
