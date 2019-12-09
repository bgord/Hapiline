import * as Async from "react-async";
import React from "react";

import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";

interface DeleteButtonProps extends IHabit {
	refreshList: VoidFunction;
}

const deleteHabitRequest: Async.DeferFn<void> = ([id]: number[]) =>
	api.delete(`/habit-scoreboard-item/${id}`).then(response => response.data);

export const DeleteHabitButton: React.FC<DeleteButtonProps> = ({
	id,
	refreshList,
}) => {
	const deleteHabitRequestState = Async.useAsync({
		deferFn: deleteHabitRequest,
		onResolve: refreshList,
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
