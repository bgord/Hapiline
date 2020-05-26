import {Dialog} from "@reach/dialog";
import * as Async from "react-async";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldValue,
	useEditableFieldState,
} from "./hooks/useEditableField";
import * as UI from "./ui";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {EditableHabitStrengthSelect} from "./EditableHabitStrengthSelect";
import {HabitCharts} from "./HabitCharts";
import {HabitVoteCommentHistory} from "./HabitVoteCommentHistory";
import {Habit, DetailedHabit} from "./interfaces/index";
import {api} from "./services/api";
import {formatTime} from "./config/DATE_FORMATS";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";
import {pluralize} from "./services/pluralize";

interface HabitItemDialogProps {
	habitId: Habit["id"];
	closeDialog: VoidFunction;
}

export const HabitItemDialog: React.FC<HabitItemDialogProps> = ({habitId, closeDialog}) => {
	useDocumentTitle("Hapiline - habit preview");
	const getHabitsRequestState = useHabitsState();

	const triggerErrorNotification = useErrorToast();

	const habitRequestState = Async.useAsync({
		promiseFn: api.habit.show,
		id: habitId,
		onReject: () => triggerErrorNotification("Fetching task details failed."),
	});
	const habit = habitRequestState?.data as DetailedHabit;

	function dismissDialog() {
		closeDialog();
		getHabitsRequestState.refetch();
	}

	return (
		<Dialog
			onDismiss={dismissDialog}
			aria-label="Show habit preview"
			style={{maxHeight: "600px", overflow: "auto"}}
		>
			<UI.Column>
				<UI.Row bg="gray-1" p="24" mainAxis="between">
					<UI.Header variant="small">Habit preview</UI.Header>
					<UI.CloseIcon onClick={dismissDialog} />
				</UI.Row>

				<Async.IfPending state={habitRequestState}>
					<UI.Text ml="24" mt="48">
						Loading details...
					</UI.Text>
				</Async.IfPending>
				<Async.IfRejected state={habitRequestState}>
					<UI.ErrorBanner m="24">Couldn't fetch task details, please try again.</UI.ErrorBanner>
				</Async.IfRejected>

				{habit?.id && (
					<UI.Column px="24">
						<UI.Row mt="24" style={{marginLeft: "-12px"}}>
							<UI.Row mr="6">
								<EditableHabitNameInput
									{...habit}
									setHabitItem={habitRequestState.setData}
									key={habit?.name}
								/>
							</UI.Row>
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
						</UI.Row>
						{!habit.is_trackable && (
							<UI.Row mt="24">
								<UI.Badge variant="neutral">Untracked</UI.Badge>
								<UI.InfoBanner size="small" ml="24">
									You cannot vote for an untracked habit.
								</UI.InfoBanner>
							</UI.Row>
						)}
						<UI.Column mt="48">
							{habit.is_trackable && (
								<HabitCharts id={habit.id}>
									<UI.Badge hidden={!habit.progress_streak} variant="positive">
										{habit.progress_streak} {pluralize("day", habit.progress_streak ?? 0)} progress
										streak
									</UI.Badge>
									<UI.Badge hidden={!habit.regress_streak} variant="negative">
										{habit.regress_streak} {pluralize("day", habit.regress_streak ?? 0)} regress
										streak
									</UI.Badge>
									<UI.Badge
										hidden={Boolean(habit.regress_streak || habit.progress_streak)}
										variant="neutral"
									>
										No streak today
									</UI.Badge>
								</HabitCharts>
							)}
							<UI.Column mt="24">
								<EditableDescription
									description={habit.description}
									habitId={habit.id}
									onResolve={habitRequestState.reload}
								/>
							</UI.Column>
							{habit.is_trackable && <HabitVoteCommentHistory habitId={habit.id} />}
							<UI.Row my="48" mainAxis="between" crossAxis="center">
								<UI.Text variant="dimmed">Created at:</UI.Text>
								<UI.Text variant="monospaced" ml="6">
									{/* TODO: make {created,updated}_at required */}
									{habit.created_at && formatTime(habit?.created_at)}
								</UI.Text>
								<UI.Text variant="dimmed" ml="24">
									Last updated at:
								</UI.Text>
								<UI.Text variant="monospaced" ml="6">
									{habit.updated_at && formatTime(habit?.updated_at)}
								</UI.Text>
								<DeleteHabitButton {...habit} />
							</UI.Row>
						</UI.Column>
					</UI.Column>
				)}
			</UI.Column>
		</Dialog>
	);
};

const EditableDescription: React.FC<{
	description: Habit["description"];
	habitId: Habit["id"];
	onResolve: VoidFunction;
}> = ({description, habitId, onResolve}) => {
	const textarea = useEditableFieldState();

	const triggerSuccessNotification = useSuccessToast();
	const triggerErrorNotification = useErrorToast();

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
			<UI.Field mt="24" mb="12">
				<UI.Label htmlFor="description">Description</UI.Label>
				<UI.Textarea
					id="description"
					onFocus={textarea.setFocused}
					placeholder="Write something..."
					value={newDescription ?? undefined}
					onChange={newDescriptionHelpers.onChange}
				/>
			</UI.Field>
			<Async.IfRejected state={updateDescriptionRequestState}>
				<UI.Error>{descriptionInlineErrorMessage}</UI.Error>
			</Async.IfRejected>
			<UI.Row>
				<SaveButton {...textarea} onClick={newDescriptionHelpers.onUpdate}>
					Save
				</SaveButton>
				<CancelButton {...textarea} onClick={newDescriptionHelpers.onClear}>
					Cancel
				</CancelButton>
			</UI.Row>
		</>
	);
};
