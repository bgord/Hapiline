import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {TrashIcon} from "./ui/icons/Trash";
import {Habit} from "./models";
import {api} from "./services/api";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";
import {useToggle} from "./hooks/useToggle";

export function DeleteHabitButton({id, name}: Habit) {
	const {on: showDialog, setOn: openDialog, setOff: closeDialog} = useToggle();

	const getHabitsRequestState = useHabitsState();

	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const [deleteHabit, deleteHabitRequestState] = useMutation<unknown, Habit["id"]>(
		api.habit.delete,
		{
			onSuccess: () => {
				getHabitsRequestState.refetch();
				triggerSuccessToast("Habit successfully deleted!");
			},
			onError: () => triggerErrorToast("Couldn't delete habit."),
		},
	);

	function confirmDeletion() {
		closeDialog();
		deleteHabit(id);
	}

	return (
		<>
			<UI.Button
				style={{width: "125px"}}
				ml="auto"
				variant="danger"
				type="submit"
				layout="with-icon"
				onClick={openDialog}
				mt="24"
			>
				<TrashIcon />
				{deleteHabitRequestState.status === "loading" ? "Loading" : "Delete"}
			</UI.Button>
			{showDialog && (
				<AlertDialog
					data-width="view-m"
					data-lg-width="auto"
					data-lg-mx="24"
					data-on-entry="slide-down"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
					<AlertDialogLabel>
						<UI.Header variant="small">Do you want to delete the following habit?</UI.Header>
					</AlertDialogLabel>
					<UI.Text mt="48">{name}</UI.Text>
					<UI.Row mt="24" mainAxis="between" wrap="wrap">
						<UI.Button mt="24" variant="outlined" onClick={confirmDeletion}>
							Yes, delete
						</UI.Button>

						<UI.Button
							mt="24"
							variant="primary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={closeDialog}
						>
							Nevermind, don't delete
						</UI.Button>
					</UI.Row>
				</AlertDialog>
			)}
		</>
	);
}
