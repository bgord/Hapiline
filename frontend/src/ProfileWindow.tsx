import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorToast} from "./contexts/toasts-context";
import {useUserProfile} from "./contexts/auth-context";

export const ProfileWindow = () => {
	return (
		<UI.Column ml="auto" mr="auto" my="48" style={{maxWidth: "var(--view-width)"}}>
			<UI.Card>
				<UI.Row bg="gray-1" mt="12" p="24">
					<UI.Header variant="large">Profile settings</UI.Header>
				</UI.Row>
				<ChangeEmail />
				<ChangePassword />
				<DeleteAccount />
			</UI.Card>
		</UI.Column>
	);
};

const ChangeEmail: React.FC = () => {
	useDocumentTitle("Hapiline - profile");

	const history = useHistory();
	const triggerErrorNotification = useErrorToast();
	const [userProfile] = useUserProfile();
	const [status, setStatus] = React.useState<"idle" | "pending" | "success" | "error">("idle");

	const initialEmail = userProfile?.email;
	const [newEmail, setNewEmail] = React.useState(initialEmail);
	const [password, setPassword] = React.useState("");

	if (!userProfile?.email) return null;

	const changeEmailRequestState = Async.useAsync({
		deferFn: api.auth.changeEmail,
		onResolve: () => {
			setStatus("success");
			setTimeout(() => history.push("/logout"), 5000);
		},
		onReject: () => {
			setStatus("error");
			triggerErrorNotification("Couldn't change email.");
		},
	});

	const isNewEmailDifferent = newEmail !== "" && newEmail !== initialEmail;
	const {errorCode, getArgErrorMessage} = getRequestStateErrors(changeEmailRequestState);

	const passwordInlineError = errorCode === "E_ACCESS_DENIED" ? "Invalid password." : null;
	const emailInlineError = getArgErrorMessage("email");

	return (
		<UI.Column
			as="form"
			onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				setStatus("pending");
				changeEmailRequestState.run(newEmail, password);
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

			{["idle", "pending", "error"].includes(status) && (
				<>
					<UI.Field mt="24" mr="12" width="100%">
						<UI.Label htmlFor="email">Email</UI.Label>
						<UI.Input
							id="email"
							value={newEmail}
							onChange={event => setNewEmail(event.target.value)}
							required
							type="email"
							disabled={status === "pending"}
							placeholder="user@example.com"
						/>
						{status === "error" && emailInlineError && <UI.Error>{emailInlineError}</UI.Error>}
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
							disabled={status === "pending"}
						/>
					</UI.Field>
				</>
			)}
			{status === "error" && passwordInlineError && <UI.Error>{passwordInlineError}</UI.Error>}

			{["idle", "pending", "error"].includes(status) && (
				<UI.Row mt="24">
					<UI.Button type="submit" variant="primary" disabled={!isNewEmailDifferent}>
						Confirm email
					</UI.Button>
				</UI.Row>
			)}

			{status === "pending" && <UI.Text mt="12">Email change pending...</UI.Text>}

			{status === "success" && (
				<UI.SuccessBanner crossAxisSelf="start" mt="24" size="big">
					<UI.Text ml="12">
						Email confirmation message has been sent!
						<br /> You will be logged out in 5 seconds.
					</UI.Text>
				</UI.SuccessBanner>
			)}
		</UI.Column>
	);
};

const ChangePassword = () => {
	const triggerErrorNotification = useErrorToast();
	const [status, setStatus] = React.useState<"idle" | "pending" | "success" | "error">("idle");
	const [oldPassword, setOldPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [newPasswordConfirmation, setNewPasswordConfirmation] = React.useState("");

	const updatePasswordRequestState = Async.useAsync({
		deferFn: api.auth.updatePassword,
		onResolve: () => {
			setStatus("success");
		},
		onReject: () => {
			setStatus("error");
			triggerErrorNotification("Couldn't update password.");
		},
	});

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
				setStatus("pending");
				updatePasswordRequestState.run(oldPassword, newPassword, newPasswordConfirmation);
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

			{["idle", "pending", "error"].includes(status) && (
				<>
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
							disabled={updatePasswordRequestState.isPending}
						/>
						{status === "error" && oldPasswordInlineError && (
							<UI.Error>{oldPasswordInlineError}</UI.Error>
						)}
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
							disabled={updatePasswordRequestState.isPending}
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
							disabled={updatePasswordRequestState.isPending}
						/>
					</UI.Field>

					<UI.Row>
						<UI.Button variant="primary" type="submit">
							Update password
						</UI.Button>
					</UI.Row>
				</>
			)}

			{status === "error" && internalServerError && <UI.Error>{internalServerError}</UI.Error>}

			{status === "success" && (
				<UI.SuccessBanner crossAxisSelf="start" size="big" mt="24">
					<UI.Text ml="6">Password changed successfully!</UI.Text>
				</UI.SuccessBanner>
			)}
		</UI.Column>
	);
};

const DeleteAccount = () => {
	const [status, setStatus] = React.useState<"idle" | "editing" | "pending" | "error">("idle");

	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerErrorNotification = useErrorToast();
	const history = useHistory();

	const deleteAccountRequestState = Async.useAsync({
		deferFn: api.auth.deleteAccount,
		onResolve: () => history.push("/logout"),
		onReject: () => {
			setStatus("error");
			triggerErrorNotification("Couldn't delete account.");
		},
	});

	function confirmDeletion() {
		setStatus("pending");
		deleteAccountRequestState.run();
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
				disabled={deleteAccountRequestState.isPending}
				onClick={() => setStatus("editing")}
				mr="auto"
			>
				Delete account
			</UI.Button>

			<Async.IfRejected state={deleteAccountRequestState}>
				<UI.Error mt="12">An error occurred during account deletion.</UI.Error>
			</Async.IfRejected>

			{status === "editing" && (
				<AlertDialog leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}>
					<AlertDialogLabel>
						<UI.Header variant="small">Do you really want to delete your account? </UI.Header>
					</AlertDialogLabel>
					<UI.Row mt="48" mainAxis="between">
						<UI.Button variant="danger" onClick={confirmDeletion}>
							Yes, delete
						</UI.Button>
						<UI.Button
							variant="primary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={() => setStatus("idle")}
						>
							Nevermind, don't delete
						</UI.Button>
					</UI.Row>
				</AlertDialog>
			)}
		</UI.Column>
	);
};
