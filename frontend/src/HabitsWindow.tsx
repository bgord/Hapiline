import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {Column} from "./ui/column/Column";
import {ErrorMessage} from "./ErrorMessages";
import {HabitList} from "./HabitList";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";

export const HabitsWindow = () => {
	const getHabitsRequestState = useHabitsState();
	const [subview] = useQueryParam("subview");

	const {errorMessage} = getRequestStateErrors(getHabitsRequestState);

	return (
		<Column>
			{subview === "add_habit" && <AddHabitForm />}

			<Async.IfRejected state={getHabitsRequestState}>
				<ErrorMessage className="mt-4 text-center">{errorMessage}</ErrorMessage>
			</Async.IfRejected>

			<Async.IfFulfilled state={getHabitsRequestState}>
				<HabitList />
			</Async.IfFulfilled>
		</Column>
	);
};
