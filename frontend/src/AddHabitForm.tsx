import * as Async from "react-async";
import React from "react";

import {CloseableSuccessMessage} from "./SuccessMessages";
import {ErrorMessage} from "./ErrorMessages";
import {HabitNameInput} from "./HabitNameInput";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";
import {useUserProfile} from "./contexts/auth-context";

export const AddHabitForm: React.FC<{
	refreshList: VoidFunction;
}> = ({refreshList}) => {
	const [name, setName] = React.useState("");
	const [score, setScore] = React.useState("neutral");

	const [profile] = useUserProfile();

	const addHabitRequestState = Async.useAsync({
		deferFn: api.habit.post,
		onResolve: function clearForm() {
			setName("");
			setScore("neutral");
			refreshList();
		},
	});

	const {getArgError, errorMessage} = useRequestErrors(addHabitRequestState);
	const nameInlineError = getArgError("name");

	return (
		<div>
			<form
				onSubmit={event => {
					event.preventDefault();
					addHabitRequestState.run(name, score, profile?.id);
				}}
				className="flex items-end"
			>
				<div className="flex flex-col">
					<label className="field-label" htmlFor="name">
						Habit
					</label>
					<HabitNameInput
						value={name}
						onChange={event => setName(event.target.value)}
						className="field w-64"
					/>
				</div>
				<div className="flex flex-col ml-8">
					<label className="field-label" htmlFor="score">
						Score
					</label>
					<select
						id="score"
						name="score"
						required
						value={score}
						onChange={event => setScore(event.target.value)}
						className="field bg-white"
					>
						<option value="neutral">Neutral</option>
						<option value="positive">Positive</option>
						<option value="negative">Negative</option>
					</select>
				</div>
				<button className="btn btn-blue ml-8 h-10" type="submit">
					Add habit
				</button>
			</form>
			<Async.IfFulfilled state={addHabitRequestState}>
				<CloseableSuccessMessage>
					Habit successfully addedd!
				</CloseableSuccessMessage>
			</Async.IfFulfilled>
			<Async.IfRejected state={addHabitRequestState}>
				<ErrorMessage className="mt-4">
					{nameInlineError?.message || errorMessage}
				</ErrorMessage>
			</Async.IfRejected>
		</div>
	);
};
