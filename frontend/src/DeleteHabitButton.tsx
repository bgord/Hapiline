import * as Async from "react-async";
import React from "react";

import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";

interface DeleteButtonProps extends IHabit {
	refreshList: VoidFunction;
}

export const DeleteHabitButton: React.FC<DeleteButtonProps> = ({
	id,
	refreshList,
}) => {
	const [triggerSuccessNotification] = useNotification();
	const [triggerErrorNotification] = useNotification();

	const deleteHabitRequestState = Async.useAsync({
		deferFn: api.habit.delete,
		onResolve: () => {
			refreshList();
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
	const textColor = deleteHabitRequestState.isPending
		? "text-gray-900"
		: "text-red-500";

	return (
		<button
			onClick={() => deleteHabitRequestState.run(id)}
			type="button"
			className={`uppercase px-4 text-sm font-semibold  inline ${textColor}`}
			disabled={deleteHabitRequestState.isPending}
		>
			{deleteHabitRequestState.isPending ? "Loading" : "Delete"}
		</button>
	);
};
