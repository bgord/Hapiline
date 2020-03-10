import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import * as Async from "react-async";
import React from "react";

import {Button, Text, Row, Header} from "./ui";
import {TrashIcon} from "./ui/icons/Trash";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";
import {useToggle} from "./hooks/useToggle";

export const DeleteHabitButton: React.FC<IHabit> = ({id, name}) => {
	const [showDialog, openDialog, closeDialog] = useToggle();
	const getHabitsRequestState = useHabitsState();

	const cancelRef = React.useRef<HTMLButtonElement>();

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const deleteHabitRequestState = Async.useAsync({
		deferFn: api.habit.delete,
		onResolve: () => {
			getHabitsRequestState.reload();
			triggerSuccessNotification("Habit successfully deleted!");
		},
		onReject: () => triggerErrorNotification("Couldn't delete habit."),
	});

	function confirmDeletion() {
		closeDialog();
		deleteHabitRequestState.run(id);
	}

	return (
		<>
			<Button
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "125px",
				}}
				ml="auto"
				variant="outlined"
				type="submit"
				onClick={openDialog}
			>
				<TrashIcon />
				{deleteHabitRequestState.isPending ? "Loading" : "Delete"}
			</Button>
			{showDialog && (
				<AlertDialog leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}>
					<AlertDialogLabel>
						<Header variant="small">Do you want to delete the following habit?</Header>
					</AlertDialogLabel>
					<Text mt="48">{name}</Text>
					<Row mt="48" mainAxis="between">
						<Button variant="outlined" onClick={confirmDeletion}>
							Yes, delete
						</Button>
						<Button
							variant="primary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={closeDialog}
						>
							Nevermind, don't delete
						</Button>
					</Row>
				</AlertDialog>
			)}
		</>
	);
};
