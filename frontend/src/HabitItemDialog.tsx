import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldValue,
	useEditableFieldState,
} from "./hooks/useEditableField";
import {CloseIcon, Textarea, Field, Row, Label, Text, Header, Badge, InfoBanner} from "./ui";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {EditableHabitStrengthSelect} from "./EditableHabitStrengthSelect";
import {ErrorMessage, RequestErrorMessage} from "./ErrorMessages";
import {HabitCharts} from "./HabitCharts";
import {HabitVoteCommentHistory} from "./HabitVoteCommentHistory";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {formatTime} from "./config/DATE_FORMATS";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";

interface HabitItemDialogProps {
	habitId: IHabit["id"];
	closeDialog: VoidFunction;
}

export const HabitItemDialog: React.FC<HabitItemDialogProps> = ({habitId, closeDialog}) => {
	useDocumentTitle("Hapiline - habit preview");
	const getHabitsRequestState = useHabitsState();

	const triggerErrorNotification = useErrorNotification();

	const habitRequestState = Async.useAsync({
		promiseFn: api.habit.show,
		id: habitId,
		onReject: () => triggerErrorNotification("Fetching task details failed."),
	});
	const habit = habitRequestState?.data as IHabit;

	function dismissDialog() {
		closeDialog();
		getHabitsRequestState.reload();
	}

	return (
		<Dialog
			onDismiss={dismissDialog}
			aria-label="Show habit preview"
			style={{maxHeight: "600px", overflow: "auto"}}
		>
			<Async.IfPending state={habitRequestState}>Loading details...</Async.IfPending>
			<Async.IfRejected state={habitRequestState}>
				<RequestErrorMessage>Couldn't fetch task details, please try again.</RequestErrorMessage>
			</Async.IfRejected>
			{habit?.id && (
				<>
					<Row p="24" mainAxis="between" style={{background: "var(--gray-1)"}}>
						<Header variant="small">Habit preview</Header>
						<CloseIcon onClick={dismissDialog} />
					</Row>
					<Row mt="24" pl="12" pr="24">
						<EditableHabitNameInput
							{...habit}
							setHabitItem={habitRequestState.setData}
							key={habit?.name}
						/>
						<EditableHabitScoreSelect
							{...habit}
							setHabitItem={habitRequestState.setData}
							key={habit?.score}
						/>
						<EditableHabitStrengthSelect
							{...habit}
							setHabitItem={habitRequestState.setData}
							key={habit?.strength}
						/>
					</Row>
					<Row mt="24" px="24">
						{!habit.is_trackable && (
							<>
								<Badge variant="neutral">Untracked</Badge>
								<InfoBanner px="6" py="3" ml="24">
									You cannot vote for an untracked habit.
								</InfoBanner>
							</>
						)}
					</Row>
					{habit.is_trackable && (
						<>
							<Text mt="24" style={{textTransform: "uppercase"}}>
								<div className="text-green-600" hidden={!habit.progress_streak}>
									Progress streak: {habit.progress_streak} days
								</div>
								<div className="text-red-600" hidden={!habit.regress_streak}>
									Regress streak: {habit.regress_streak} days
								</div>
								<div
									className="text-gray-600"
									hidden={Boolean(habit.regress_streak || habit.progress_streak)}
								>
									No streak today
								</div>
							</Text>
							<HabitCharts id={habit.id} />
						</>
					)}
					<EditableDescription
						description={habit.description}
						habitId={habit.id}
						onResolve={habitRequestState.reload}
					/>
					{habit.is_trackable && <HabitVoteCommentHistory habitId={habit.id} />}
					<Row mainAxis="between">
						<dl className="flex items-baseline py-8">
							<dt>
								<Text variant="dimmed">Created at:</Text>
							</dt>
							<dd className="text-sm ml-1 mr-4 font-mono">{formatTime(habit?.created_at)}</dd>
							<dt>
								<Text variant="dimmed">Updated at:</Text>
							</dt>
							<dd className="text-sm ml-1 font-mono">{formatTime(habit?.updated_at)}</dd>
						</dl>
						<DeleteHabitButton {...habit} />
					</Row>
				</>
			)}
		</Dialog>
	);
};

const EditableDescription: React.FC<{
	description: IHabit["description"];
	habitId: IHabit["id"];
	onResolve: VoidFunction;
}> = ({description, habitId, onResolve}) => {
	const textarea = useEditableFieldState();

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const updateDescriptionRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: () => {
			triggerSuccessNotification("Comment added successfully!");
			textarea.setIdle();
			onResolve();
		},
		onReject: () => triggerErrorNotification("Habit description couldn't be changed"),
	});

	const [newDescription, newDescriptionHelpers] = useEditableFieldValue(
		updateDescription =>
			updateDescriptionRequestState.run(habitId, {description: updateDescription}),
		description,
	);

	const {getArgErrorMessage} = getRequestStateErrors(updateDescriptionRequestState);
	const descriptionInlineErrorMessage = getArgErrorMessage("description");

	return (
		<>
			<Field mt="24" mb="12">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					onFocus={textarea.setFocused}
					placeholder="Write something..."
					value={newDescription ?? undefined}
					onChange={newDescriptionHelpers.onChange}
				/>
			</Field>
			<Async.IfRejected state={updateDescriptionRequestState}>
				<ErrorMessage>{descriptionInlineErrorMessage}</ErrorMessage>
			</Async.IfRejected>
			<Row>
				<SaveButton {...textarea} onClick={newDescriptionHelpers.onUpdate}>
					Save
				</SaveButton>
				<CancelButton {...textarea} onClick={newDescriptionHelpers.onClear}>
					Cancel
				</CancelButton>
			</Row>
		</>
	);
};
