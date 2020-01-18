import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {ErrorMessage} from "./ErrorMessages";
import {HabitList} from "./HabitList";
import {InfoMessage} from "./InfoMessage";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useHabits, useHabitsState} from "./contexts/habits-context";

export const HabitsWindow = () => {
	const habits = useHabits();
	const getHabitsRequestState = useHabitsState();

	const {errorMessage} = getRequestStateErrors(getHabitsRequestState);

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
				<HabitList />
			</Async.IfFulfilled>
		</section>
	);
};
