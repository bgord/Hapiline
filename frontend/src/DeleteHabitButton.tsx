import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
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
			<Button variant="outlined" onClick={openDialog} style={{marginLeft: "6px"}}>
				{deleteHabitRequestState.isPending ? "Loading" : "Delete"}
			</Button>
			{showDialog && (
				<AlertDialog
					className="w-1/3"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
					<AlertDialogLabel>
						Do you want to delete the <span className="italic">{`"${name}"`}</span> habit?
					</AlertDialogLabel>

					<div className="mt-12 flex justify-around w-full">
						<Button variant="outlined" onClick={confirmDeletion}>
							Yes, delete
						</Button>
						<Button
							variant="secondary"
							ref={cancelRef as React.RefObject<HTMLButtonElement>}
							onClick={closeDialog}
						>
							Nevermind, don't delete
						</Button>
					</div>
				</AlertDialog>
			)}
		</>
	);
};
