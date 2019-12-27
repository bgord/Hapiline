import {ApiError} from "./services/api";

import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {HabitNameInput} from "./HabitNameInput";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";
import {useRequestErrors} from "./hooks/useRequestErrors";
import {useUserProfile} from "./contexts/auth-context";

export const AddHabitForm: React.FC<{refreshList: VoidFunction}> = ({
	refreshList,
}) => {
	const [profile] = useUserProfile();

	const [name, setName] = React.useState("");
	const [score, setScore] = React.useState("neutral");

	const [triggerSuccessNotification] = useNotification();
	const [triggerUnexpectedErrorNotification] = useNotification();

	const addHabitRequestState = Async.useAsync({
		deferFn: api.habit.post,
		onResolve: () => {
			setName("");
			setScore("neutral");
			refreshList();
			triggerSuccessNotification({
				type: "success",
				message: "Habit successfully addedd!",
			});
		},
		onReject: _error => {
			const error = _error as ApiError;
			if (error.response?.status === 500) {
				triggerUnexpectedErrorNotification({
					type: "error",
					message: "Habit couldn't be added.",
				});
			}
		},
	});

	const {getArgError, errorMessage} = useRequestErrors(addHabitRequestState);
	const nameInlineError = getArgError("name");

	return (
		<>
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
			<Async.IfRejected state={addHabitRequestState}>
				<ErrorMessage className="mt-4">
					{nameInlineError?.message || errorMessage}
				</ErrorMessage>
			</Async.IfRejected>
		</>
	);
};
