import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import React from "react";
import {useHistory} from "react-router-dom";
import {useMutation} from "react-query";

import {api} from "../../services/api";
import {useErrorToast} from "../../contexts/toasts-context";
import {useToggle} from "../../hooks/useToggle";
import * as UI from "../../ui";

export const ProfileDeleteAccount = () => {
	const {
		on: isAccountDeletionModalVisible,
		setOn: showAccountDeletionModal,
		setOff: hideAccountDeletionModal,
	} = useToggle(false);

	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerErrorToast = useErrorToast();
	const history = useHistory();

	const [deleteAccount, deleteAccountRequestState] = useMutation(api.auth.deleteAccount, {
		onSuccess: () => history.push("/logout"),
		onError: () => triggerErrorToast("Couldn't delete account."),
	});

	function confirmDeletion() {
		deleteAccount();
		hideAccountDeletionModal();
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
				onClick={showAccountDeletionModal}
				mr="auto"
			>
				Delete account
			</UI.Button>

			<UI.ShowIf request={deleteAccountRequestState} is="error">
				<UI.Error mt="12">An error occurred during account deletion.</UI.Error>
			</UI.ShowIf>

			{isAccountDeletionModalVisible && (
				<AlertDialog
					data-width="view-m"
					data-lg-width="auto"
					data-lg-mx="12"
					data-on-entry="slide-down"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
					<AlertDialogLabel>
						<UI.Header variant="small">Do you really want to delete your account?</UI.Header>
					</AlertDialogLabel>
					<UI.Row mt="48" mainAxis="between" wrap="wrap">
						<UI.Button variant="danger" onClick={confirmDeletion}>
							Yes, delete
						</UI.Button>
						<UI.Button
							variant="primary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={hideAccountDeletionModal}
							mt={[, "24"]}
						>
							Nevermind, don't delete
						</UI.Button>
					</UI.Row>
				</AlertDialog>
			)}
		</UI.Column>
	);
};
