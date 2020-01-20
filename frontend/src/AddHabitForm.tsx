import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import {CloseButton} from "./CloseButton";
import {ErrorMessage} from "./ErrorMessages";
import {HabitNameInput} from "./HabitNameInput";
import {api} from "./services/api";
import {getRequestErrors, getRequestStateErrors} from "./selectors/getRequestErrors";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";
import {useQueryParams} from "./hooks/useQueryParam";
import {useUserProfile} from "./contexts/auth-context";

export const AddHabitForm: React.FC = () => {
	const [profile] = useUserProfile();
	const getHabitsRequestState = useHabitsState();

	const [name, setName] = React.useState("");
	const [score, setScore] = React.useState("positive");
	const [strength, setStrength] = React.useState("established");
	const [description, setDescription] = React.useState("");

	const triggerSuccessNotification = useSuccessNotification();
	const triggerUnexpectedErrorNotification = useErrorNotification();

	const [, updateQueryParams] = useQueryParams();

	const addHabitRequestState = Async.useAsync({
		deferFn: api.habit.post,
		onResolve: () => {
			setName("");
			setScore("positive");
			setStrength("established");
			setDescription("");
			getHabitsRequestState.reload();
			triggerSuccessNotification("Habit successfully addedd!");
		},
		onReject: error => {
			const {responseStatus} = getRequestErrors(error);
			if (responseStatus === 500) {
				triggerUnexpectedErrorNotification("Habit couldn't be added.");
			}
		},
	});

	const {getArgErrorMessage, errorMessage} = getRequestStateErrors(addHabitRequestState);
	const nameInlineErrorMessage = getArgErrorMessage("name");
	const descriptionInlineErrorMessage = getArgErrorMessage("description");

	function hideAddFormDialog() {
		updateQueryParams("habits", {});
	}

	return (
		<Dialog
			aria-label="Add new habit"
			onDismiss={hideAddFormDialog}
			className="overflow-auto h-full"
			style={{
				maxWidth: "1000px",
				maxHeight: "500px",
			}}
		>
			<div className="flex justify-end items-baseline mb-8">
				<CloseButton onClick={hideAddFormDialog} />
			</div>
			<form
				onSubmit={event => {
					event.preventDefault();
					addHabitRequestState.run(name, score, strength, profile?.id, description || null);
				}}
				className="flex flex-col w-full"
			>
				<div className="flex w-full">
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
							onBlur={event => setScore(event.target.value)}
							className="field bg-white"
						>
							<option value="positive">positive</option>
							<option value="neutral">neutral</option>
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
							onBlur={event => setStrength(event.target.value)}
							className="field bg-white"
						>
							<option value="established">established</option>
							<option value="developing">developing</option>
							<option value="fresh">fresh</option>
						</select>
					</div>
				</div>
				<Async.IfRejected state={addHabitRequestState}>
					<ErrorMessage className="mt-4">{nameInlineErrorMessage}</ErrorMessage>
				</Async.IfRejected>
				<div className="flex items-center mt-4">
					<div className="flex flex-col flex-grow">
						<label htmlFor="description" className="field-label">
							Description (optional)
						</label>
						<textarea
							rows={3}
							value={description}
							onChange={event => setDescription(event.target.value)}
							name="description"
							className="p-1 border"
							placeholder="Write something..."
						/>
					</div>
				</div>
				<Async.IfRejected state={addHabitRequestState}>
					<ErrorMessage className="mt-4">{descriptionInlineErrorMessage}</ErrorMessage>
				</Async.IfRejected>
				<button className="btn btn-blue ml-auto h-10 mt-4" type="submit">
					Add habit
				</button>
			</form>
			<Async.IfRejected state={addHabitRequestState}>
				<ErrorMessage className="mt-4">
					{!nameInlineErrorMessage && !descriptionInlineErrorMessage && errorMessage}
				</ErrorMessage>
			</Async.IfRejected>
		</Dialog>
	);
};
