import {AlertDialog, AlertDialogLabel} from "@reach/alert-dialog";
import * as Async from "react-async";
import React from "react";

import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useDialog} from "./hooks/useDialog";
import {useHabits} from "./contexts/habits-context";
import {useNotification} from "./contexts/notifications-context";

export const DeleteHabitButton: React.FC<IHabit> = ({id, name}) => {
	const [showDialog, openDialog, closeDialog] = useDialog();
	const getHabitsRequestState = useHabits();

	const cancelRef = React.useRef<HTMLButtonElement>();

	const [triggerSuccessNotification] = useNotification();
	const [triggerErrorNotification] = useNotification();

	const deleteHabitRequestState = Async.useAsync({
		deferFn: api.habit.delete,
		onResolve: () => {
			getHabitsRequestState.reload();
			triggerSuccessNotification({
				type: "success",
				message: "Habit successfully deleted!",
			});
		},
		onReject: () =>
			triggerErrorNotification({
				type: "error",
				message: "Couldn't delete habit.",
			}),
	});
	const textColor = deleteHabitRequestState.isPending ? "text-gray-900" : "text-red-500";

	return (
		<>
			<button
				onClick={openDialog}
				type="button"
				className={`uppercase px-4 text-sm font-semibold  inline ${textColor}`}
				disabled={deleteHabitRequestState.isPending}
			>
				{deleteHabitRequestState.isPending ? "Loading" : "Delete"}
			</button>
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
