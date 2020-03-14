import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {PlusCircleIcon} from "./ui/icons/PlusCircle";
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
		<Dialog data-pt="12" data-pb="48" aria-label="Add new habit" onDismiss={hideAddFormDialog}>
			<UI.Row p="24" mainAxis="between" style={{background: "var(--gray-1)"}}>
				<UI.Header variant="small">New habit</UI.Header>
				<UI.CloseIcon onClick={hideAddFormDialog} />
			</UI.Row>

			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
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
				p="24"
			>
				<UI.Row mt="48">
					<UI.Field style={{flexGrow: 1}}>
						<UI.Label htmlFor="name">Habit name</UI.Label>
						<HabitNameInput
							id="name"
							value={name}
							onChange={event => setName(event.target.value)}
						/>
					</UI.Field>
					<UI.Field ml="12">
						<UI.Label htmlFor="score">Score</UI.Label>
						<UI.Select
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
						</UI.Select>
					</UI.Field>
					<UI.Field ml="12">
						<UI.Label htmlFor="strength">Strength</UI.Label>
						<UI.Select
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
						</UI.Select>
					</UI.Field>
				</UI.Row>

				<Async.IfRejected state={addHabitRequestState}>
					<UI.Error mt="6">{nameInlineErrorMessage}</UI.Error>
				</Async.IfRejected>

				<UI.Row mt="48" crossAxis="center">
					<UI.Field variant="row">
						<UI.Checkbox
							id="is_trackable"
							name="is_trackable"
							checked={isTrackable}
							onChange={() => setIsTrackable(v => !v)}
						/>
						<UI.Label ml="6" htmlFor="is_trackable">
							Track this habit
						</UI.Label>
					</UI.Field>

					<UI.InfoBanner size="small" ml="24">
						You won't be able to vote for an untracked habit.
					</UI.InfoBanner>
				</UI.Row>

				<UI.Field mt="24">
					<UI.Label htmlFor="description">Description</UI.Label>
					<UI.Textarea
						value={description}
						onChange={event => setDescription(event.target.value)}
						name="description"
						placeholder="Write something..."
					/>
				</UI.Field>

				<Async.IfRejected state={addHabitRequestState}>
					<UI.Error mt="6">{descriptionInlineErrorMessage}</UI.Error>
				</Async.IfRejected>

				<UI.Button
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "125px",
					}}
					ml="auto"
					mt="48"
					mb="24"
					variant="primary"
					type="submit"
				>
					<PlusCircleIcon mr="auto" style={{stroke: "var(--gray-1)"}} />
					Add habit
				</UI.Button>

				<Async.IfRejected state={addHabitRequestState}>
					{!nameInlineErrorMessage && !descriptionInlineErrorMessage && (
						<UI.ErrorBanner size="big">
							{errorMessage || "Something unexpected happened. Please try again later."}
						</UI.ErrorBanner>
					)}
				</Async.IfRejected>
			</UI.Column>
		</Dialog>
	);
};
