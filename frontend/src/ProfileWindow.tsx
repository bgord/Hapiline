import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useErrorNotification} from "./contexts/notifications-context";
import {useToggle} from "./hooks/useToggle";

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
