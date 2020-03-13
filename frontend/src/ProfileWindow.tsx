import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {
	Button,
	Column,
	Card,
	Header,
	Row,
	Text,
	Label,
	Input,
	Field,
	Error,
	Banner,
	ErrorBanner,
} from "./ui";
import {InfoBanner} from "./ui/banner/Banner";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorNotification} from "./contexts/notifications-context";
import {useUserProfile} from "./contexts/auth-context";

export const ProfileWindow = () => {
	return (
		<Column ml="auto" mr="auto" my="48" style={{maxWidth: "750px"}}>
			<Card>
				<Row mt="12" p="24" style={{background: "var(--gray-1)"}}>
					<Header variant="large">Profile settings</Header>
				</Row>
				<ChangeEmail />
				<ChangePassword />
				<DeleteAccount />
			</Card>
		</Column>
	);
};

const ChangeEmail: React.FC = () => {
	useDocumentTitle("Hapiline - profile");

	const history = useHistory();
	const triggerErrorNotification = useErrorNotification();
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
		<Column
			as="form"
			onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				setStatus("pending");
				changeEmailRequestState.run(newEmail, password);
			}}
			p="24"
			style={{borderBottom: "2px solid var(--gray-2)"}}
		>
			<Header variant="extra-small" mt="12" mb="12">
				Email change
			</Header>

			<InfoBanner mt="12" py="3" px="6">
				You will have to confirm your new email adress and login back again.
			</InfoBanner>

			{["idle", "pending", "error"].includes(status) && (
				<>
					<Field mt="24" mr="12" width="100%">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={newEmail}
							onChange={event => setNewEmail(event.target.value)}
							required
							type="email"
							disabled={status === "pending"}
							placeholder="user@example.com"
						/>
						{status === "error" && emailInlineError && <Error>{emailInlineError}</Error>}
					</Field>

					<Field mt="12">
						<Label htmlFor="password">Password</Label>
						<Input
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
					</Field>
				</>
			)}
			{status === "error" && passwordInlineError && <Error>{passwordInlineError}</Error>}

			{["idle", "pending", "error"].includes(status) && (
				<Row mt="24">
					<Button type="submit" variant="primary" disabled={!isNewEmailDifferent}>
						Confirm email
					</Button>
				</Row>
			)}

			{status === "pending" && <Text mt="12">Email change pending...</Text>}

			{status === "success" && (
				<Banner variant="success" mt="12" py="6" px="12">
					Email confirmation message has been sent!
					<br /> You will be logged out in 5 seconds.
				</Banner>
			)}
		</Column>
	);
};

const ChangePassword = () => {
	const triggerErrorNotification = useErrorNotification();
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
		<Column
			as="form"
			onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				setStatus("pending");
				updatePasswordRequestState.run(oldPassword, newPassword, newPasswordConfirmation);
			}}
			p="24"
			style={{borderBottom: "2px solid var(--gray-2)"}}
		>
			<Header mt="12" mb="24" variant="extra-small">
				Password change
			</Header>

			<InfoBanner px="6" py="3" mb="24">
				You won't be logged out, remember to input the new password the next time.
			</InfoBanner>

			{["idle", "pending", "error"].includes(status) && (
				<>
					<Field mb="12">
						<Label htmlFor="old_password">Old password</Label>
						<Input
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
							<Error>{oldPasswordInlineError}</Error>
						)}
					</Field>

					<Field mb="12">
						<Label htmlFor="new_password">New password</Label>
						<Input
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
					</Field>

					<Field mb="24">
						<Label htmlFor="password_confirmation">Repeat new password</Label>
						<Input
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
					</Field>

					<Row>
						<Button variant="primary" type="submit">
							Update password
						</Button>
					</Row>
				</>
			)}

			{status === "error" && internalServerError && <Error>{internalServerError}</Error>}

			{status === "success" && (
				<Banner variant="success" mt="12" py="6" px="12">
					Password changed successfully!
				</Banner>
			)}
		</Column>
	);
};

const DeleteAccount = () => {
	const [status, setStatus] = React.useState<"idle" | "editing" | "pending" | "error">("idle");

	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerErrorNotification = useErrorNotification();
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
		<Column p="24">
			<Header mt="12" variant="extra-small">
				Account deletion
			</Header>

			<ErrorBanner mt="24" p="6">
				Your data will be removed pernamently, and you won't be able to recover your account.
			</ErrorBanner>

			<Button
				mt="24"
				variant="danger"
				disabled={deleteAccountRequestState.isPending}
				onClick={() => setStatus("editing")}
				mr="auto"
			>
				Delete account
			</Button>

			<Async.IfRejected state={deleteAccountRequestState}>
				<Error mt="12">An error occurred during account deletion.</Error>
			</Async.IfRejected>

			{status === "editing" && (
				<AlertDialog leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}>
					<AlertDialogLabel>
						<Header variant="small">Do you really want to delete your account? </Header>
					</AlertDialogLabel>
					<Row mt="48" mainAxis="between">
						<Button variant="danger" onClick={confirmDeletion}>
							Yes, delete
						</Button>
						<Button
							variant="primary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={() => setStatus("idle")}
						>
							Nevermind, don't delete
						</Button>
					</Row>
				</AlertDialog>
			)}
		</Column>
	);
};
