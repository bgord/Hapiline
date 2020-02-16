import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import {Field} from "./ui/field/Field";
import {Label} from "./ui/label/Label";
import {Textarea} from "./ui/textarea/Textarea";
import {Button} from "./ui/button/Button";
import {CloseIcon} from "./ui/close-icon/CloseIcon";
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
	const [isTrackable, setIsTrackable] = React.useState(true);

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
			setIsTrackable(true);
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
			className="max-w-screen-lg overflow-auto h-full"
			style={{maxHeight: "500px"}}
		>
			<div className="flex justify-between items-baseline mb-8">
				<strong>Add new habit</strong>
				<CloseIcon onClick={hideAddFormDialog} />
			</div>
			<form
				onSubmit={event => {
					event.preventDefault();
					addHabitRequestState.run(
						name,
						score,
						strength,
						profile?.id,
						description || null,
						isTrackable,
					);
				}}
				className="flex flex-col w-full"
			>
				<div className="flex w-full">
					<Field variant="column" style={{flexGrow: 1}}>
						<HabitNameInput value={name} onChange={event => setName(event.target.value)} />
						<Label htmlFor="habit_name">Habit name</Label>
					</Field>
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
					<input
						type="checkbox"
						id="is_trackable"
						name="is_trackable"
						checked={isTrackable}
						onChange={() => setIsTrackable(v => !v)}
						className="field bg-white"
					/>
					<label className="field-label mb-0 ml-1" htmlFor="is_trackable">
						Track this habit
					</label>
				</div>
				<Field variant="column" style={{marginTop: "18px"}}>
					<Textarea
						value={description}
						onChange={event => setDescription(event.target.value)}
						name="description"
						placeholder="Write something..."
					/>
					<Label htmlFor="description">Description</Label>
				</Field>
				<Async.IfRejected state={addHabitRequestState}>
					<ErrorMessage className="mt-4">{descriptionInlineErrorMessage}</ErrorMessage>
				</Async.IfRejected>
				<Button
					variant="secondary"
					type="submit"
					style={{marginTop: "24px", alignSelf: "flex-end", width: "125px"}}
				>
					Add habit
				</Button>
			</form>
			<Async.IfRejected state={addHabitRequestState}>
				<ErrorMessage className="mt-4">
					{!nameInlineErrorMessage && !descriptionInlineErrorMessage && errorMessage}
				</ErrorMessage>
			</Async.IfRejected>
		</Dialog>
	);
};
