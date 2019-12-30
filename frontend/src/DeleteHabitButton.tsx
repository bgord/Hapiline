import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useDialog} from "./hooks/useDialog";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";

export const DeleteHabitButton: React.FC<IHabit> = ({id, name}) => {
	const [showDialog, openDialog, closeDialog] = useDialog();
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

	return (
		<>
			<BareButton onClick={openDialog} className="text-red-500">
				{deleteHabitRequestState.isPending ? "Loading" : "Delete"}
			</BareButton>
			{showDialog && (
				<AlertDialog
					className="w-1/3"
					leastDestructiveRef={cancelRef as React.RefObject<HTMLElement>}
				>
					<AlertDialogLabel>
						Do you want to delete the <span className="italic">{`"${name}"`}</span> habit?
					</AlertDialogLabel>

					<div className="mt-12 flex justify-around w-full">
						<button
							type="button"
							onClick={() => {
								closeDialog();
								deleteHabitRequestState.run(id);
							}}
						>
							Yes, delete
						</button>
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
