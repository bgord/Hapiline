import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import {Select} from "./ui/select/Select";
import {Checkbox} from "./ui/checkbox/Checkbox";
import {Header} from "./ui/header/Header";
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
			<div className="flex justify-between items-center mb-8">
				<Header variant="small">New habit</Header>
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
					<Field style={{flexGrow: 1}}>
						<Label htmlFor="habit_name">Habit name</Label>
						<HabitNameInput value={name} onChange={event => setName(event.target.value)} />
					</Field>
					<Field style={{marginLeft: "12px"}}>
						<Label htmlFor="score">Score</Label>
						<Select
							id="score"
							name="score"
							required
							value={score}
							onChange={event => setScore(event.target.value)}
							onBlur={event => setScore(event.target.value)}
						>
							<option value="positive">positive</option>
							<option value="neutral">neutral</option>
							<option value="negative">negative</option>
						</Select>
					</Field>
					<Field style={{marginLeft: "12px"}}>
						<Label htmlFor="strength">Strength</Label>
						<Select
							id="strength"
							name="strength"
							required
							value={strength}
							onChange={event => setStrength(event.target.value)}
							onBlur={event => setStrength(event.target.value)}
						>
							<option value="established">established</option>
							<option value="developing">developing</option>
							<option value="fresh">fresh</option>
						</Select>
					</Field>
				</div>
				<Async.IfRejected state={addHabitRequestState}>
					<ErrorMessage className="mt-4">{nameInlineErrorMessage}</ErrorMessage>
				</Async.IfRejected>
				<Field variant="row" style={{alignSelf: "flex-start", marginTop: "24px"}}>
					<Checkbox
						id="is_trackable"
						name="is_trackable"
						checked={isTrackable}
						onChange={() => setIsTrackable(v => !v)}
					/>
					<Label htmlFor="is_trackable" style={{marginLeft: "8px"}}>
						Track this habit
					</Label>
				</Field>
				<Field style={{marginTop: "24px"}}>
					<Label htmlFor="description">Description</Label>
					<Textarea
						value={description}
						onChange={event => setDescription(event.target.value)}
						name="description"
						placeholder="Write something..."
					/>
				</Field>
				<Async.IfRejected state={addHabitRequestState}>
					<ErrorMessage className="mt-4">{descriptionInlineErrorMessage}</ErrorMessage>
				</Async.IfRejected>
				<Button
					variant="primary"
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
