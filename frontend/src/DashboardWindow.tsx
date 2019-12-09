import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {InfoMessage} from "./InfoMessage";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";
import {EditableHabitNameInput} from "./EditableHabitNameInput";

const getHabitsRequest: Async.PromiseFn<IHabit[]> = () =>
	api.get<IHabit[]>("/habit-scoreboard-items").then(response => response.data);

export const Dashboard = () => {
	const [currentlyEditedHabitId, setCurrentlyEditedHabitId] = React.useState<
		IHabit["id"]
	>();

	const getHabitsRequestState = Async.useAsync({
		promiseFn: getHabitsRequest,
	});
	const {errorMessage} = useRequestErrors(getHabitsRequestState);

	return (
		<section className="flex flex-col items-center py-8">
			<AddHabitForm refreshHabitList={getHabitsRequestState.reload} />

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
							<div className="bg-gray-300 w-20 flex justify-center items-center">
								{item.score}
							</div>
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
