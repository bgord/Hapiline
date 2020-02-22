import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Column} from "./ui/column/Column";
import {Divider} from "./ui/divider/Divider";
import {Field} from "./ui/field/Field";
import {Header} from "./ui/header/Header";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";
import {RequestErrorMessage, ErrorMessage} from "./ErrorMessages";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useErrorNotification} from "./contexts/notifications-context";
import {useUserProfile} from "./contexts/auth-context";

export const ProfileWindow = () => {
	return (
		<Column style={{maxWidth: "750px", margin: "48px auto 0 auto"}}>
			<Header variant="large">Profile settings</Header>
			<Divider style={{width: "200px", marginTop: "6px"}} />
			<ChangeEmail />
			<ChangePassword />
			<DeleteAccount />
		</Column>
	);
};

const ChangeEmail: React.FC = () => {
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
			className="flex flex-col flex-grow mt-12"
		>
			<>
				<Header variant="extra-small">Email change</Header>
				<Row crossAxis="end">
					<Field style={{marginRight: "12px", marginTop: "24px"}}>
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
							variant="outlined"
							onClick={() => {
								setStatus("idle");
								setPassword("");
								setNewEmail(initialEmail);
							}}
							style={{marginLeft: "6px"}}
						>
							Cancel
						</Button>
					)}
				</Row>
				{status === "error" && emailInlineError && <ErrorMessage>{emailInlineError}</ErrorMessage>}
			</>
			{["editing", "pending", "error"].includes(status) && (
				<Column style={{maxWidth: "405px", marginTop: "12px"}}>
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
			<Text style={{marginTop: "24px"}}>
				NOTE: You will have to confirm your new email adress and login back again.
			</Text>
			{status === "pending" && <Text style={{marginTop: "12px"}}>Email change pending...</Text>}
			{status === "success" && (
				<Text>
					Email confirmation message has been sent!
					<br />
					You will be logged out in 5 seconds.
				</Text>
			)}
			<Divider style={{marginTop: "48px"}} />
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
			className="my-4"
			onSubmit={event => {
				event.preventDefault();
				setStatus("pending");
				updatePasswordRequestState.run(oldPassword, newPassword, newPasswordConfirmation);
			}}
		>
			<Header variant="extra-small" style={{marginBottom: "24px"}}>
				Password change
			</Header>
			{["idle", "pending", "success"].includes(status) && (
				<Button variant="secondary" onClick={() => setStatus("editing")}>
					Update password
				</Button>
			)}
			{["editing", "pending", "error"].includes(status) && (
				<>
					<Field style={{marginBottom: "12px"}}>
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
					<Field style={{marginBottom: "12px"}}>
						<Label htmlFor="new_password">New password</Label>{" "}
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
					<Field style={{marginBottom: "24px"}}>
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
					<Button variant="primary" type="submit">
						Submit
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							setStatus("idle");
							setOldPassword("");
							setNewPassword("");
							setNewPasswordConfirmation("");
						}}
						style={{marginLeft: "6px"}}
					>
						Cancel
					</Button>
					{status === "error" && internalServerError && (
						<RequestErrorMessage>{internalServerError}</RequestErrorMessage>
					)}
				</>
			)}
			{status === "success" && <Text>Password changed successfully!</Text>}
			<Divider style={{marginTop: "48px"}} />
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
			<Header variant="extra-small" style={{marginBottom: "36px"}}>
				Account deletion
			</Header>
			<Button
				variant="primary"
				disabled={deleteAccountRequestState.isPending}
				onClick={() => setStatus("editing")}
				style={{margin: "0 auto 0 0"}}
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
					<Row mainAxis="between" style={{marginTop: "48px"}}>
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
