import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import React from "react";
import {useHistory} from "react-router-dom";
import {useMutation} from "react-query";

import {api} from "../../services/api";
import {useErrorToast} from "../../contexts/toasts-context";
import * as UI from "../../ui";

export const ProfileDeleteAccount = () => {
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
