import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {InfoMessage} from "./InfoMessage";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";
import {useRequestErrors} from "./hooks/useRequestErrors";

export const Dashboard = () => {
	const [currentlyEditedHabitId, setCurrentlyEditedHabitId] = React.useState<
		IHabit["id"]
	>();

	const [triggerErrorNotification] = useNotification({
		type: "error",
		message: "Couldn't fetch habit list.",
	});

	const getHabitsRequestState = Async.useAsync({
		promiseFn: api.habit.get,
		onReject: triggerErrorNotification,
	});
	const {errorMessage} = useRequestErrors(getHabitsRequestState);

	return (
		<section className="flex flex-col items-center py-8">
			<AddHabitForm refreshList={getHabitsRequestState.reload} />

			<Async.IfRejected state={getHabitsRequestState}>
				<ErrorMessage className="mt-4 text-center">{errorMessage}</ErrorMessage>
			</Async.IfRejected>

			<ul className="flex flex-col mt-12 bg-white p-4 pb-0 max-w-2xl w-full">
				<Async.IfFulfilled state={getHabitsRequestState}>
					{!getHabitsRequestState?.data?.length && (
						<InfoMessage className="pb-4">
							Seems you haven't added any habits yet.
						</InfoMessage>
					)}
					{getHabitsRequestState?.data?.map(item => (
						<li className="flex align-baseline mb-4" key={item.id}>
							<EditableHabitScoreSelect
								{...item}
								refreshList={getHabitsRequestState.reload}
							/>
							<div className="flex justify-between w-full">
								<EditableHabitNameInput
									{...item}
									currentlyEditedHabitId={currentlyEditedHabitId}
									setCurrentlyEditedHabitId={setCurrentlyEditedHabitId}
									refreshList={getHabitsRequestState.reload}
								/>
								<DeleteHabitButton
									{...item}
									refreshList={getHabitsRequestState.reload}
								/>
							</div>
						</li>
					))}
				</Async.IfFulfilled>
			</ul>
		</section>
	);
};
