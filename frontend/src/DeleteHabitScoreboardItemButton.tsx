import * as Async from "react-async";
import React from "react";

import {HabitScoreboardItem} from "./interfaces/HabitScoreboardItem";
import {api} from "./services/api";

interface DeleteButtonProps {
	id: HabitScoreboardItem["id"];
	refreshList: VoidFunction;
}

const performDeleteHabitScoreboardItemsRequest: Async.DeferFn<void> = ([
	id,
]: number[]) =>
	api.delete(`/habit-scoreboard-item/${id}`).then(response => response.data);

export const DeleteButton: React.FC<DeleteButtonProps> = ({
	id,
	refreshList,
}) => {
	const deleteHabitScoreboardItemsRequestState = Async.useAsync({
		deferFn: performDeleteHabitScoreboardItemsRequest,
		onResolve: refreshList,
	});
	return (
		<button
			onClick={() => deleteHabitScoreboardItemsRequestState.run(id)}
			type="button"
			className="uppercase px-4 text-sm font-semibold text-red-500 inline"
			disabled={deleteHabitScoreboardItemsRequestState.isPending}
		>
			{deleteHabitScoreboardItemsRequestState.isPending ? "Loading" : "Delete"}
		</button>
	);
};
