import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {HabitNameInput} from "./HabitNameInput";
import {api} from "./services/api";
import {extractRequestErrors, getRequestErrors} from "./selectors/getRequestErrors";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";
import {useUserProfile} from "./contexts/auth-context";

export const AddHabitForm: React.FC = () => {
	const [profile] = useUserProfile();
	const getHabitsRequestState = useHabitsState();

	const [name, setName] = React.useState("");
	const [score, setScore] = React.useState("neutral");
	const [strength, setStrength] = React.useState("established");

	const triggerSuccessNotification = useSuccessNotification();
	const triggerUnexpectedErrorNotification = useErrorNotification();

	const addHabitRequestState = Async.useAsync({
		deferFn: api.habit.post,
		onResolve: () => {
			setName("");
			setScore("neutral");
			setStrength("established");
			getHabitsRequestState.reload();
			triggerSuccessNotification("Habit successfully addedd!");
		},
		onReject: error => {
			const {responseStatus} = extractRequestErrors(error);
			if (responseStatus === 500) {
				triggerUnexpectedErrorNotification("Habit couldn't be added.");
			}
		},
	});

	const {getArgErrorMessage, errorMessage} = getRequestErrors(addHabitRequestState);
	const nameInlineErrorMessage = getArgErrorMessage("name");

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
				<ErrorMessage className="mt-4">{nameInlineErrorMessage || errorMessage}</ErrorMessage>
			</Async.IfRejected>
		</>
	);
};
