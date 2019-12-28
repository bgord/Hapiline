import {api, ApiError} from "./services/api";

import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {HabitNameInput} from "./HabitNameInput";
import {useNotification} from "./contexts/notifications-context";
import {useRequestErrors} from "./hooks/useRequestErrors";
import {useUserProfile} from "./contexts/auth-context";

export const AddHabitForm: React.FC<{refreshList: VoidFunction}> = ({
	refreshList,
}) => {
	const [profile] = useUserProfile();

	const [name, setName] = React.useState("");
	const [score, setScore] = React.useState("neutral");
	const [strength, setStrength] = React.useState("established");

	const [triggerSuccessNotification] = useNotification();
	const [triggerUnexpectedErrorNotification] = useNotification();

	const addHabitRequestState = Async.useAsync({
		deferFn: api.habit.post,
		onResolve: () => {
			setName("");
			setScore("neutral");
			setStrength("established");
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
					addHabitRequestState.run(name, score, strength, profile?.id);
				}}
				className="flex items-end w-full"
			>
				<div className="flex flex-col flex-grow">
					<label className="field-label" htmlFor="name">
						Habit
					</label>
					<HabitNameInput
						value={name}
						onChange={event => setName(event.target.value)}
						className="field w-full"
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
						<option value="neutral">neutral</option>
						<option value="positive">positive</option>
						<option value="negative">negative</option>
					</select>
				</div>
				<div className="flex flex-col ml-8">
					<label className="field-label" htmlFor="strength">
						Strength
					</label>
					<select
						id="strength"
						name="strength"
						required
						value={strength}
						onChange={event => setStrength(event.target.value)}
						className="field bg-white"
					>
						<option value="established">established</option>
						<option value="developing">developing</option>
						<option value="fresh">fresh</option>
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
