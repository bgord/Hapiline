import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button, Column, Card, Header, Divider, Row, Text, Label, Input, Field} from "./ui";
import {RequestErrorMessage, ErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorNotification} from "./contexts/notifications-context";
import {useUserProfile} from "./contexts/auth-context";

export const ProfileWindow = () => {
	return (
		<Column ml="auto" mr="auto" mt="72" style={{maxWidth: "750px"}}>
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
	const [status, setStatus] = React.useState<"idle" | "editing" | "pending" | "success" | "error">(
		"idle",
	);

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
		<form
			onSubmit={event => {
				event.preventDefault();
				setStatus("pending");
				changeEmailRequestState.run(newEmail, password);
			}}
		>
			<Column>
				<Header variant="extra-small" mt="48" mb="12">
					Email change
				</Header>
				<Row crossAxis="end">
					<Field mt="24" mr="12" style={{flexGrow: 1}}>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={newEmail}
							onChange={event => setNewEmail(event.target.value)}
							required
							type="email"
							disabled={["idle", "pending", "success"].includes(status)}
							placeholder="user@example.com"
						/>
					</Field>
					{status === "idle" && (
						<Button variant="primary" onClick={() => setStatus("editing")}>
							Edit email
						</Button>
					)}
					{["editing", "error"].includes(status) && (
						<Button type="submit" variant="primary" disabled={!isNewEmailDifferent}>
							Confirm email
						</Button>
					)}
					{["editing", "error"].includes(status) && (
						<Button
							ml="6"
							variant="outlined"
							onClick={() => {
								setStatus("idle");
								setPassword("");
								setNewEmail(initialEmail);
							}}
						>
							Cancel
						</Button>
					)}
				</Row>
				{status === "error" && emailInlineError && <Text mt="12">{emailInlineError}</Text>}
			</Column>
			{["editing", "pending", "error"].includes(status) && (
				<Column mt="12">
					<Field>
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
					{status === "error" && passwordInlineError && (
						<ErrorMessage>{passwordInlineError}</ErrorMessage>
					)}
				</Column>
			)}
			<Text mt="24">
				NOTE: You will have to confirm your new email adress and login back again.
			</Text>
			{status === "pending" && <Text mt="12">Email change pending...</Text>}
			{status === "success" && (
				<Column mt="6">
					<Text>Email confirmation message has been sent!</Text>
					<Text>You will be logged out in 5 seconds.</Text>
				</Column>
			)}
			<Divider mt="48" />
		</form>
	);
};

const ChangePassword = () => {
	const triggerErrorNotification = useErrorNotification();
	const [status, setStatus] = React.useState<"idle" | "editing" | "pending" | "success" | "error">(
		"idle",
	);
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
		<form
			onSubmit={event => {
				event.preventDefault();
				setStatus("pending");
				updatePasswordRequestState.run(oldPassword, newPassword, newPasswordConfirmation);
			}}
		>
			<Column>
				<Header mt="24" mb="24" variant="extra-small">
					Password change
				</Header>
				{["idle", "pending", "success"].includes(status) && (
					<Button
						variant="secondary"
						onClick={() => setStatus("editing")}
						style={{alignSelf: "flex-start"}}
					>
						Update password
					</Button>
				)}
				{["editing", "pending", "error"].includes(status) && (
					<Column>
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
						</Field>
						{status === "error" && oldPasswordInlineError && (
							<RequestErrorMessage>{oldPasswordInlineError}</RequestErrorMessage>
						)}
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
								Submit
							</Button>
							<Button
								ml="6"
								variant="outlined"
								onClick={() => {
									setStatus("idle");
									setOldPassword("");
									setNewPassword("");
									setNewPasswordConfirmation("");
								}}
							>
								Cancel
							</Button>
						</Row>
						{status === "error" && internalServerError && (
							<RequestErrorMessage>{internalServerError}</RequestErrorMessage>
						)}
					</Column>
				)}
				{status === "success" && <Text mt="12">Password changed successfully!</Text>}
				<Divider mt="24" />
			</Column>
		</form>
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
		<>
			<Header mt="24" variant="extra-small">
				Account deletion
			</Header>
			<Button
				mt="24"
				variant="primary"
				disabled={deleteAccountRequestState.isPending}
				onClick={() => setStatus("editing")}
				mr="auto"
			>
				Delete account
			</Button>
			<Async.IfRejected state={deleteAccountRequestState}>
				<RequestErrorMessage>An error occurred during account deletion.</RequestErrorMessage>
			</Async.IfRejected>
			{status === "editing" && (
				<AlertDialog
					className="w-1/4"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
					<AlertDialogLabel>
						<Header variant="small">Do you really want to delete your account? </Header>
					</AlertDialogLabel>
					<Row mt="48" mainAxis="between">
						<Button variant="outlined" onClick={confirmDeletion}>
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
		</>
	);
};
