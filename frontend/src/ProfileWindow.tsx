import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {RequestErrorMessage, ErrorMessage} from "./ErrorMessages";
import {SuccessMessage} from "./SuccessMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useErrorNotification} from "./contexts/notifications-context";
import {useToggle} from "./hooks/useToggle";
import {useUserProfile} from "./contexts/auth-context";

export const ProfileWindow = () => {
	const [showDialog, openDialog, closeDialog] = useToggle();
	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerErrorNotification = useErrorNotification();
	const history = useHistory();

	const deleteAccountRequestState = Async.useAsync({
		deferFn: api.auth.deleteAccount,
		onResolve: () => history.push("/logout"),
		onReject: () => triggerErrorNotification("Couldn't delete account."),
	});

	function confirmDeletion() {
		closeDialog();
		deleteAccountRequestState.run();
	}

	return (
		<>
			<section className="flex flex-col max-w-2xl mx-auto mt-12">
				<strong>Profile</strong>
				<button
					className="mt-10 bg-red-500 w-32 text-white"
					disabled={deleteAccountRequestState.isPending}
					onClick={openDialog}
				>
					Delete account
				</button>
				<Async.IfRejected state={deleteAccountRequestState}>
					<RequestErrorMessage>An error occurred during account deletion.</RequestErrorMessage>
				</Async.IfRejected>
				<ChangeEmail />
				<ChangePassword />
			</section>

			{showDialog && (
				<AlertDialog
					className="w-1/3"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
					<AlertDialogLabel>Do you really want to delete your account?</AlertDialogLabel>

					<div className="mt-12 flex justify-around w-full">
						<BareButton onClick={confirmDeletion}>Yes, delete</BareButton>
						<button
							type="button"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={closeDialog}
						>
							Nevermind, don't delete
						</button>
					</div>
				</AlertDialog>
			)}
		</>
	);
};

const ChangeEmail: React.FC = () => {
	const history = useHistory();
	const triggerErrorNotification = useErrorNotification();
	const [userProfile] = useUserProfile();
	const [status, setStatus] = React.useState<"idle" | "editing" | "pending" | "success" | "error">(
		"idle",
	);

	if (!userProfile?.email) return null;

	const initialEmail = userProfile?.email;
	const [newEmail, setNewEmail] = React.useState(initialEmail);
	const [password, setPassword] = React.useState("");

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
			className="flex flex-col flex-grow mt-8"
		>
			<div>
				<label className="field-label" htmlFor="email">
					Email
				</label>
				<div>
					<input
						required
						value={newEmail}
						onChange={event => setNewEmail(event.target.value)}
						className="field w-64"
						type="email"
						name="email"
						id="email"
						disabled={["idle", "pending", "success"].includes(status)}
					/>
					{status === "idle" && (
						<BareButton onClick={() => setStatus("editing")}>Edit email</BareButton>
					)}
					{["editing", "error"].includes(status) && (
						<button disabled={!isNewEmailDifferent} className="btn btn-blue ml-4" type="submit">
							Confirm email
						</button>
					)}
					{["editing", "error"].includes(status) && (
						<BareButton
							onClick={() => {
								setStatus("idle");
								setPassword("");
								setNewEmail(initialEmail);
							}}
						>
							Cancel
						</BareButton>
					)}
				</div>
				<div className="mt-4">
					NOTE: You will have to confirm your new email adress and login back again.
				</div>
				{status === "error" && emailInlineError && <ErrorMessage>{emailInlineError}</ErrorMessage>}
			</div>
			{["editing", "pending", "error"].includes(status) && (
				<div className="flex flex-col flex-grow mt-4 w-64">
					<label className="field-label" htmlFor="password">
						Password
					</label>
					<input
						required
						pattern=".{6,}"
						title="Password should contain at least 6 characters."
						value={password}
						onChange={event => setPassword(event.target.value)}
						className="field"
						type="password"
						name="password"
						id="password"
						placeholder="********"
						disabled={status === "pending"}
					/>
					{status === "error" && passwordInlineError && (
						<ErrorMessage>{passwordInlineError}</ErrorMessage>
					)}
				</div>
			)}
			{status === "pending" && <div className="mt-4">Email change pending...</div>}
			{status === "success" && (
				<>
					<SuccessMessage>Email confirmation message has been sent!</SuccessMessage>
					<div>You will be logged out in 5 seconds.</div>
				</>
			)}
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

	const {getArgErrorMessage, errorMessage, errorCode} = getRequestStateErrors(
		updatePasswordRequestState,
	);

	const oldPasswordInlineError = getArgErrorMessage("old_password");

	const internalServerError =
		errorCode === "E_INTERNAL_SERVER_ERROR"
			? "An unexpected error happened, please try again."
			: null;

	return (
		<form
			className="my-8"
			onSubmit={event => {
				event.preventDefault();
				setStatus("pending");
				updatePasswordRequestState.run(oldPassword, newPassword, newPasswordConfirmation);
			}}
		>
			{["idle", "pending", "success"].includes(status) && (
				<BareButton onClick={() => setStatus("editing")}>Update password</BareButton>
			)}
			{["editing", "pending", "error"].includes(status) && (
				<>
					<div className="field-group mb-6 md:w-full">
						<label className="field-label" htmlFor="old_password">
							Old password
						</label>
						<input
							className="field"
							name="old_password"
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
							<RequestErrorMessage>{oldPasswordInlineError}</RequestErrorMessage>
						)}
					</div>
					<div className="field-group mb-6 md:w-full">
						<label className="field-label" htmlFor="new_password">
							New password
						</label>
						<input
							className="field"
							name="new_password"
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
					</div>
					<div className="field-group mb-6 md:w-full">
						<label className="field-label" htmlFor="password_confirmation">
							Repeat new password
						</label>
						<input
							className="field"
							type="password"
							name="password_confirmation"
							id="password_confirmation"
							placeholder="********"
							pattern={newPassword}
							title="Passwords have to be equal"
							value={newPasswordConfirmation}
							onChange={event => setNewPasswordConfirmation(event.target.value)}
							required
							disabled={updatePasswordRequestState.isPending}
						/>
					</div>
					<BareButton type="submit">Submit</BareButton>
					<BareButton
						onClick={() => {
							setStatus("idle");
							setOldPassword("");
							setNewPassword("");
							setNewPasswordConfirmation("");
						}}
					>
						Cancel
					</BareButton>
					{status === "error" && internalServerError && (
						<RequestErrorMessage>{internalServerError}</RequestErrorMessage>
					)}
				</>
			)}
			{status == "success" && <SuccessMessage>Password changed successfully!</SuccessMessage>}
		</form>
	);
};
