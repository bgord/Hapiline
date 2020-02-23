import * as Async from "react-async";
import React from "react";

import {AddHabitForm} from "./AddHabitForm";
import {Button} from "./ui/button/Button";
import {Column} from "./ui/column/Column";
import {ErrorMessage} from "./ErrorMessages";
import {HabitList} from "./HabitList";
import {Text} from "./ui/text/Text";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useHabits, useHabitsState} from "./contexts/habits-context";
import {useQueryParam} from "./hooks/useQueryParam";

export const HabitsWindow = () => {
	const habits = useHabits();
	const getHabitsRequestState = useHabitsState();
	const [subview, updateSubviewQueryParam] = useQueryParam("subview");

	const {errorMessage} = getRequestStateErrors(getHabitsRequestState);

	function openAddFormDialog() {
		updateSubviewQueryParam("add_habit");
	}

	return (
		<Column>
			{subview === "add_habit" && <AddHabitForm />}

			<Async.IfRejected state={getHabitsRequestState}>
				<ErrorMessage className="mt-4 text-center">{errorMessage}</ErrorMessage>
			</Async.IfRejected>

			<Async.IfFulfilled state={getHabitsRequestState}>
				{habits.length === 0 && (
					<div className="flex justify-between items-center w-full">
						<Text>Seems you haven't added any habits yet.</Text>
						<Button variant="primary" onClick={openAddFormDialog} style={{width: "125px"}}>
							New habit
						</Button>
					</div>
				)}

				{habits.length > 0 && <HabitList />}
			</Async.IfFulfilled>
		</Column>
	);
};
