import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {ErrorMessage} from "./ErrorMessages";
import {HabitNameInput} from "./HabitNameInput";
import {IHabit} from "./interfaces/IHabit";
import {InfoMessage} from "./InfoMessage";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";

const getHabitsRequest: Async.PromiseFn<IHabit[]> = () =>
	api.get<IHabit[]>("/habit-scoreboard-items").then(response => response.data);

const editHabitRequest: Async.DeferFn<IHabit> = ([id, payload]) =>
	api
		.patch<IHabit>(`/habit-scoreboard-item/${id}`, payload)
		.then(response => response.data);

export const Dashboard = () => {
	const [currentlyditedHabitId, setCurrentlyEditedHabitId] = React.useState<
		IHabit["id"]
	>();

	const [newName, setNewName] = React.useState<IHabit["name"]>();

	const getHabitsRequestState = Async.useAsync({
		promiseFn: getHabitsRequest,
	});
	const {errorMessage} = useRequestErrors(getHabitsRequestState);

	const editHabitRequestState = Async.useAsync({
		deferFn: editHabitRequest,
		onResolve: () => setCurrentlyEditedHabitId(undefined),
	});

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
								<div className="flex justify-between items-center w-full">
									<HabitNameInput
										onFocus={() => {
											setCurrentlyEditedHabitId(item.id);
											setNewName(undefined);
										}}
										className={`mx-4 p-1 break-words pr-4 flex-grow focus:bg-gray-100 ${
											currentlyditedHabitId === item.id ? "bg-gray-100" : ""
										}`}
										value={
											currentlyditedHabitId === item.id ? newName : item.name
										}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setNewName(event.target.value)
										}
									/>
									{currentlyditedHabitId === item.id && (
										<div>
											<button
												onClick={() => {
													editHabitRequestState.run(item.id, {name: newName});
													getHabitsRequestState.reload();
												}}
												className="uppercase mr-4"
												type="button"
											>
												Save
											</button>
											<button
												onClick={() => {
													setNewName(name);
													setCurrentlyEditedHabitId(undefined);
													setNewName(undefined);
												}}
												className="uppercase"
												type="button"
											>
												Reset
											</button>
										</div>
									)}
								</div>
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
