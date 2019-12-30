import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {ErrorMessage} from "./ErrorMessages";
import {HabitList} from "./HabitList";
import {HabitsSummary} from "./HabitsSummary";
import {InfoMessage} from "./InfoMessage";
import {useHabitsState} from "./contexts/habits-context";
import {useRequestErrors} from "./hooks/useRequestErrors";

export const Dashboard = () => {
	const getHabitsRequestState = useHabitsState();
	const {errorMessage} = useRequestErrors(getHabitsRequestState);
	const habits = getHabitsRequestState?.data ?? [];

	return (
		<section className="flex flex-col items-center p-8 mx-auto max-w-4xl">
			<AddHabitForm />
			<Async.IfRejected state={getHabitsRequestState}>
				<ErrorMessage className="mt-4 text-center">{errorMessage}</ErrorMessage>
			</Async.IfRejected>
			<Async.IfFulfilled state={getHabitsRequestState}>
				{!habits.length && (
					<InfoMessage className="pb-4">Seems you haven't added any habits yet.</InfoMessage>
				)}
				<HabitsSummary />
				<HabitList />
			</Async.IfFulfilled>
		</section>
	);
};
