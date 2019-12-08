import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";

const getHabitsRequest: Async.PromiseFn<IHabit[]> = () =>
	api.get<IHabit[]>("/habit-scoreboard-items").then(response => response.data);

export const Dashboard = () => {
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

			<div
				className="mt-12 bg-white p-4"
				style={{
					display: "grid",
					gridTemplateColumns: "100px 440px 100px",
					gridTemplateRows: "auto",
					gridRowGap: "30px",
				}}
			>
				<Async.IfFulfilled state={getHabitsRequestState}>
					{!getHabitsRequestState?.data?.length && (
						<div className="text-center" style={{gridColumn: "span 2"}}>
							Seems you haven't added any habits yet.
						</div>
					)}
					{getHabitsRequestState?.data?.map(item => (
						<>
							<span
								style={{
									placeSelf: "center",
								}}
								className="bg-gray-300 w-full text-center"
							>
								{item.score}
							</span>
							<span className="pl-4 break-words pr-4">{item.name}</span>
							<DeleteHabitButton
								refreshList={getHabitsRequestState.reload}
								id={item.id}
							/>
						</>
					))}
				</Async.IfFulfilled>
			</div>
		</section>
	);
};
