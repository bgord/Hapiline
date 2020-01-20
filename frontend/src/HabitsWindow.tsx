import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {ErrorMessage} from "./ErrorMessages";
import {HabitList} from "./HabitList";
import {InfoMessage} from "./InfoMessage";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";

export const HabitsWindow = () => {
	const habits = useHabits();
	const getHabitsRequestState = useHabitsState();

	const {errorMessage} = getRequestStateErrors(getHabitsRequestState);

	const [subview] = useQueryParam("subview");

	return (
		<section className="flex flex-col items-center p-8 mx-auto max-w-4xl">
			{subview === "add_habit" && <AddHabitForm />}

			<Async.IfRejected state={getHabitsRequestState}>
				<ErrorMessage className="mt-4 text-center">{errorMessage}</ErrorMessage>
			</Async.IfRejected>

			<Async.IfFulfilled state={getHabitsRequestState}>
				{habits.length === 0 && (
					<InfoMessage className="pb-4 mr-auto">
						Seems you haven't added any habits yet.
					</InfoMessage>
				)}

				{habits.length > 0 && <HabitList />}
			</Async.IfFulfilled>
		</section>
	);
};
