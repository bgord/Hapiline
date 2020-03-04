import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

// prettier-ignore
import {Button, Textarea, Field, Label, Checkbox, Row, Select, Header, CloseIcon, Column, Banner, Text} from "./ui";
import {InfoIcon} from "./ui/icons/Info";
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
			data-pt="12"
			aria-label="Add new habit"
			onDismiss={hideAddFormDialog}
			style={{maxHeight: "600px", height: "100%"}}
		>
			<Row p="24" mainAxis="between" style={{background: "var(--gray-1)"}}>
				<Header variant="small">New habit</Header>
				<CloseIcon onClick={hideAddFormDialog} />
			</Row>
			<Column data-p="24">
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
					<Row mt="48">
						<Field style={{flexGrow: 1}}>
							<Label htmlFor="name">Habit name</Label>
							<HabitNameInput
								id="name"
								value={name}
								onChange={event => setName(event.target.value)}
							/>
						</Field>
						<Field ml="12">
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
						<Field ml="12">
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
					</Row>
					<Async.IfRejected state={addHabitRequestState}>
						<ErrorMessage className="mt-4">{nameInlineErrorMessage}</ErrorMessage>
					</Async.IfRejected>
					<Row mt="48" crossAxis="center">
						<Field variant="row">
							<Checkbox
								id="is_trackable"
								name="is_trackable"
								checked={isTrackable}
								onChange={() => setIsTrackable(v => !v)}
							/>
							<Label ml="6" htmlFor="is_trackable">
								Track this habit
							</Label>
						</Field>
						<Banner style={{padding: "3px 6px"}} data-ml="24" variant="info">
							<InfoIcon />
							<Text ml="12">You won't be able to vote for an untracked habit.</Text>
						</Banner>
					</Row>
					<Field mt="24">
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
						mt="24"
						style={{alignSelf: "flex-end", width: "125px"}}
					>
						Add habit
					</Button>
				</form>
			</Column>

			<Async.IfRejected state={addHabitRequestState}>
				<ErrorMessage className="mt-4">
					{!nameInlineErrorMessage && !descriptionInlineErrorMessage && errorMessage}
				</ErrorMessage>
			</Async.IfRejected>
		</Dialog>
	);
};
