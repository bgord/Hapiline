import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {ErrorMessage} from "./ErrorMessages";
import {HabitList} from "./HabitList";
import {InfoMessage} from "./InfoMessage";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";
import {useRequestErrors} from "./hooks/useRequestErrors";

export const Dashboard = () => {
	const [triggerErrorNotification] = useNotification();

	const getHabitsRequestState = Async.useAsync({
		promiseFn: api.habit.get,
		onReject: () =>
			triggerErrorNotification({
				type: "error",
				message: "Couldn't fetch habit list.",
			}),
	});
	const {errorMessage} = useRequestErrors(getHabitsRequestState);

	return (
		<section className="flex flex-col items-center py-8">
			<AddHabitForm refreshList={getHabitsRequestState.reload} />

			<Async.IfRejected state={getHabitsRequestState}>
				<ErrorMessage className="mt-4 text-center">{errorMessage}</ErrorMessage>
			</Async.IfRejected>

			<Async.IfFulfilled state={getHabitsRequestState}>
				{!getHabitsRequestState?.data?.length && (
					<InfoMessage className="pb-4">
						Seems you haven't added any habits yet.
					</InfoMessage>
				)}
				<HabitList
					habits={getHabitsRequestState?.data ?? []}
					refreshList={getHabitsRequestState.reload}
				/>
			</Async.IfFulfilled>
		</section>
	);
};
