import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Header} from "./ui/header/Header";
import {IHabit} from "./interfaces/IHabit";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
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
			<Button ml="6" variant="outlined" onClick={openDialog}>
				{deleteHabitRequestState.isPending ? "Loading" : "Delete"}
			</Button>
			{showDialog && (
				<AlertDialog
					className="w-1/3"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
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
