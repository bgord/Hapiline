import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";

const getHabitsRequest: Async.PromiseFn<IHabit[]> = () =>
	api.get<IHabit[]>("/habit-scoreboard-items").then(response => response.data);

export const Dashboard = () => {
	const [currentlyditedHabitId, setCurrentlyEditedHabitId] = React.useState<
		IHabit["id"]
	>();

	const [newName, setNewName] = React.useState<IHabit["name"]>();

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

			<ul className="flex flex-col mt-12 bg-white p-4 max-w-2xl w-full">
				<Async.IfFulfilled state={getHabitsRequestState}>
					{!getHabitsRequestState?.data?.length && (
						<div className="text-center" style={{gridColumn: "span 2"}}>
							Seems you haven't added any habits yet.
						</div>
					)}
					{getHabitsRequestState?.data?.map(item => (
						<li className="flex align-baseline mb-4" key={item.id}>
							<div className="bg-gray-300 w-20 flex justify-center items-center">
								{item.score}
							</div>
							<div className="flex justify-between w-full">
								<EditableHabitNameInput
									id={item.id}
									name={item.name}
									newName={newName}
									setNewName={setNewName}
									isHabitCurrentlyEdited={currentlyditedHabitId === item.id}
									setHabitAsCurrentlyEdited={() => {
										setCurrentlyEditedHabitId(item.id);
										setNewName(undefined);
									}}
									clearCurrentlyEditedHabit={() => {
										setCurrentlyEditedHabitId(undefined);
										setNewName(undefined);
									}}
									refreshList={getHabitsRequestState.reload}
								/>
								<DeleteHabitButton
									refreshList={getHabitsRequestState.reload}
									id={item.id}
								/>
							</div>
						</li>
					))}
				</Async.IfFulfilled>
			</ul>
		</section>
	);
};
